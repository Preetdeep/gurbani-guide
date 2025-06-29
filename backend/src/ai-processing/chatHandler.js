// Simple mock for development without OpenAI
const mockOpenAI = null;

const gurbaniSearch = require('./gurbaniSearch');
const searchEngine = require('./searchEngine');
const supabase = require('../database/supabase');

// Check if OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OpenAI API key missing. AI features will be disabled.');
  console.warn('   Add OPENAI_API_KEY to your .env file');
}

let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

class ChatHandler {
  async processMessage({ message, userId, context = {} }) {
    try {
      // Analyze the spiritual question
      const intent = await this.analyzeIntent(message);
      
      // Search for relevant Gurbani and content
      const relevantContent = await this.findRelevantContent(message, intent);
      
      // Generate AI response with sources
      const response = await this.generateResponse(message, relevantContent, context);
      
      // Store conversation for learning
      await this.storeConversation(userId, message, response);
      
      return response;
      
    } catch (error) {
      console.error('Chat processing error:', error);
      throw new Error('Failed to process spiritual guidance request');
    }
  }

  async analyzeIntent(message) {
    if (!openai) {
      // Fallback intent analysis without AI
      const keywords = message.toLowerCase();
      if (keywords.includes('gurbani') || keywords.includes('verse')) return 'gurbani_verse';
      if (keywords.includes('history') || keywords.includes('guru')) return 'historical';
      if (keywords.includes('practice') || keywords.includes('ritual')) return 'ritual_practice';
      return 'life_guidance'; // Default
    }

    const prompt = `
    Analyze this spiritual question and categorize the intent:
    
    Question: "${message}"
    
    Categories:
    - gurbani_verse: Looking for specific Gurbani verses
    - life_guidance: Seeking life advice based on Sikh principles
    - ritual_practice: Questions about Sikh practices and rituals
    - historical: Questions about Sikh history or Guru examples
    - philosophical: Deep spiritual or philosophical questions
    - daily_inspiration: Looking for daily motivation or inspiration
    
    Respond with just the category name.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
      temperature: 0.1
    });

    return response.choices[0].message.content.trim();
  }

  async findRelevantContent(message, intent) {
    const searchResults = {
      verses: [],
      katha: [],
      historical: [],
      sources: []
    };

    // Search Gurbani verses
    if (intent === 'gurbani_verse' || intent === 'life_guidance' || intent === 'philosophical') {
      searchResults.verses = await gurbaniSearch.searchVerses(message, 5);
    }

    // Search katha content
    if (intent === 'life_guidance' || intent === 'philosophical') {
      searchResults.katha = await searchEngine.searchAllKatha(message, 3);
    }

    // Search historical content
    if (intent === 'historical' || intent === 'life_guidance') {
      searchResults.historical = await searchEngine.searchHistorical(message, 3);
    }

    return searchResults;
  }

  async generateResponse(message, content, context) {
    if (!openai) {
      // Fallback response without AI
      return {
        text: `Thank you for your spiritual question: "${message}". I would love to help you with authentic Sikh guidance, but I need an OpenAI API key to provide personalized responses. Please add your API key to the .env file to enable AI-powered spiritual guidance.`,
        sources: this.extractSources(content),
        verses: content.verses || [],
        confidence: 0.1
      };
    }

    const systemPrompt = `
    You are a knowledgeable and compassionate Sikh spiritual guide. Your role is to provide authentic guidance based on Gurbani (the teachings in Sri Guru Granth Sahib) and Sikh principles.

    Guidelines:
    1. Always base responses on authentic Sikh sources
    2. Cite specific verses, sources, or historical examples when possible
    3. Be respectful and humble in tone
    4. Provide practical application of spiritual teachings
    5. Use simple, accessible language
    6. Include both Gurmukhi and English when quoting verses
    7. Never make up verses or false attributions

    Available content for this response:
    ${JSON.stringify(content, null, 2)}
    `;

    const userPrompt = `
    Question: ${message}
    
    Please provide a helpful, authentic response based on Sikh teachings. Include relevant verses and sources from the content provided.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return {
      text: response.choices[0].message.content,
      sources: this.extractSources(content),
      verses: content.verses || [],
      confidence: this.calculateConfidence(content)
    };
  }

  extractSources(content) {
    const sources = [];
    
    if (content.verses && content.verses.length > 0) {
      content.verses.forEach(verse => {
        sources.push({
          type: 'gurbani',
          reference: verse.reference,
          text: verse.gurmukhi
        });
      });
    }

    if (content.katha && content.katha.length > 0) {
      content.katha.forEach(k => {
        sources.push({
          type: 'katha',
          scholar: k.scholar,
          topic: k.topic
        });
      });
    }

    if (content.historical && content.historical.length > 0) {
      content.historical.forEach(h => {
        sources.push({
          type: 'historical',
          title: h.title,
          context: h.context
        });
      });
    }

    return sources;
  }

  calculateConfidence(content) {
    let score = 0;
    
    if (content.verses && content.verses.length > 0) score += 0.4;
    if (content.katha && content.katha.length > 0) score += 0.3;
    if (content.historical && content.historical.length > 0) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  async storeConversation(userId, question, response) {
    try {
      const { error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          question,
          response: response.text,
          sources: response.sources,
          confidence: response.confidence,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to store conversation:', error);
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
}

module.exports = new ChatHandler();
