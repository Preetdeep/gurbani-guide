const supabase = require('../database/supabase');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class GurbaniSearch {
  async searchVerses(query, limit = 10) {
    try {
      // Generate embedding for the search query
      const embedding = await this.generateEmbedding(query);
      
      // Search using semantic similarity
      const { data, error } = await supabase
        .rpc('search_gurbani_verses', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) {
        console.error('Supabase search error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Gurbani search error:', error);
      return [];
    }
  }

  async getDailyVerse() {
    try {
      // Get a verse based on current date for consistency
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      
      const { data, error } = await supabase
        .from('gurbani_verses')
        .select('*')
        .limit(1)
        .range(dayOfYear % 1000, dayOfYear % 1000); // Simple modulo for rotation

      if (error) throw error;

      return data && data.length > 0 ? data[0] : await this.getRandomVerse();
    } catch (error) {
      console.error('Daily verse error:', error);
      return await this.getRandomVerse();
    }
  }

  async getRandomVerse() {
    try {
      const { data, error } = await supabase
        .from('gurbani_verses')
        .select('*')
        .limit(1)
        .order('random()');

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Random verse error:', error);
      return null;
    }
  }

  async getVerseByReference(ang, line = null) {
    try {
      let query = supabase
        .from('gurbani_verses')
        .select('*')
        .eq('ang', ang);

      if (line !== null) {
        query = query.eq('line_number', line);
      }

      const { data, error } = await query.limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Verse lookup error:', error);
      return null;
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await openai.embeddings.create({
        model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
        input: text
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }

  async searchByKeywords(keywords, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('gurbani_verses')
        .select('*')
        .or(keywords.map(keyword => 
          `english_translation.ilike.%${keyword}%,gurmukhi.ilike.%${keyword}%`
        ).join(','))
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Keyword search error:', error);
      return [];
    }
  }

  async searchByAuthor(author, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('gurbani_verses')
        .select('*')
        .eq('author', author)
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Author search error:', error);
      return [];
    }
  }

  async searchByRaag(raag, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('gurbani_verses')
        .select('*')
        .eq('raag', raag)
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Raag search error:', error);
      return [];
    }
  }
}

module.exports = new GurbaniSearch();
