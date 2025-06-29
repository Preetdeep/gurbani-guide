// backend/src/ai-processing/gurbaniAI.js
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

class GurbaniAI {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
    this.gurbaniData = null;
    this.kathakars = null;
    this.loadData();
  }

  loadData() {
    try {
      // Try loading complete database first
      const completePath = path.join(__dirname, '../../../data/gurbani/processed/complete_sggs_database.json');
      if (fs.existsSync(completePath)) {
        this.gurbaniData = JSON.parse(fs.readFileSync(completePath, 'utf8'));
        if (this.gurbaniData.categorizedVerses) {
          this.gurbaniData = this.gurbaniData.categorizedVerses;
        }
        console.log('✅ Complete SGGS database loaded successfully');
        console.log(`📊 Total categories: ${Object.keys(this.gurbaniData).length}`);
        
        // Log verse counts per category
        Object.keys(this.gurbaniData).forEach(category => {
          console.log(`   ${category}: ${this.gurbaniData[category].length} verses`);
        });
      } else {
        // Fallback to manual database
        const manualPath = path.join(__dirname, '../../../data/gurbani/processed/manual_gurbani_database.json');
        if (fs.existsSync(manualPath)) {
          this.gurbaniData = JSON.parse(fs.readFileSync(manualPath, 'utf8'));
          console.log('✅ Manual Gurbani database loaded successfully');
        } else {
          console.log('⚠️ No database found, creating sample data...');
          this.createSampleData();
        }
      }

      // Load kathakar profiles
      const kathakarPath = path.join(__dirname, '../../../data/kathakar-profiles.json');
      if (fs.existsSync(kathakarPath)) {
        this.kathakars = JSON.parse(fs.readFileSync(kathakarPath, 'utf8'));
        console.log('✅ Kathakar profiles loaded');
      } else {
        console.log('⚠️ Creating sample kathakar data...');
        this.createSampleKathakars();
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      this.createSampleData();
      this.createSampleKathakars();
    }
  }

  createSampleData() {
    this.gurbaniData = {
      work_professional: [
        {
          id: 'work_001',
          gurmukhi: 'ਕਰਮੀ ਆਵੈ ਕਪੜਾ ਨਦਰੀ ਮੋਖੁ ਦੁਆਰੁ',
          pronunciation: 'karmee aavai kaparraa nadaree mokh duaar',
          translation: 'Through karma, comes the robe of honor; through His Grace, the door of liberation.',
          ang: 8,
          raag: 'Japji Sahib',
          author: 'Guru Nanak Dev Ji',
          modern_context: 'Hard work and ethical conduct in professional life leads to success, but ultimate fulfillment comes through divine grace.',
          practical_advice: 'Work diligently and honestly, but remember that results are in God\'s hands.'
        }
      ],
      family_relationships: [
        {
          id: 'family_001',
          gurmukhi: 'ਮਾਤ ਪਿਤਾ ਕੀ ਸੇਵਾ ਕਰੇ ਅੰਤ ਕਾਲਿ ਨ ਛੋਡੈ ਸੰਗੁ',
          pronunciation: 'maat pitaa kee sevaa kare ant kaal na chhodai sang',
          translation: 'One who serves their mother and father - their company shall not leave them even at the time of death.',
          ang: 1200,
          raag: 'Sarang',
          author: 'Guru Arjan Dev Ji',
          modern_context: 'Caring for elderly parents is a sacred duty that brings spiritual merit and peace.',
          practical_advice: 'Make time for your parents despite busy schedules.'
        }
      ],
      mental_wellness: [
        {
          id: 'mental_001',
          gurmukhi: 'ਸਰਬ ਰੋਗ ਕਾ ਔਖਦੁ ਨਾਮੁ',
          pronunciation: 'sarab rog kaa aukhadh naam',
          translation: 'The Name of the Lord is the medicine for all diseases.',
          ang: 274,
          raag: 'Gauri',
          author: 'Guru Arjan Dev Ji',
          modern_context: 'Mental health issues like anxiety and depression can be helped through spiritual practice.',
          practical_advice: 'When feeling anxious, spend time in Naam Simran and meditation.'
        }
      ],
      technology_balance: [
        {
          id: 'tech_001',
          gurmukhi: 'ਮਾਇਆ ਮੋਹਣੀ ਮੋਹਿਆ ਮੋਹਣੀ ਮੋਹੈ ਮਾਇ',
          pronunciation: 'maiaa mohanee mohiaa mohanee mohai maai',
          translation: 'Maya is fascinating and deluding; the fascinating Maya has fascinated my mind.',
          ang: 921,
          raag: 'Ramkali',
          author: 'Guru Nanak Dev Ji',
          modern_context: 'Social media and digital devices can be like Maya - fascinating but ultimately distracting from spiritual growth.',
          practical_advice: 'Set boundaries with technology. Designate phone-free times for prayer, family, and reflection.'
        }
      ],
      spiritual_practice: [
        {
          id: 'spiritual_001',
          gurmukhi: 'ਅੰਮ੍ਰਿਤ ਵੇਲਾ ਸਚੁ ਨਾਉ ਵਡਿਆਈ ਵੀਚਾਰੁ',
          pronunciation: 'amrit velaa sach naau vadiaaee veechaar',
          translation: 'In the Amrit Vela, the ambrosial hours before dawn, chant the True Name, and contemplate His Glorious Greatness.',
          ang: 2,
          raag: 'Japji Sahib',
          author: 'Guru Nanak Dev Ji',
          modern_context: 'Starting the day with spiritual practice sets a positive tone and connects us with the divine.',
          practical_advice: 'Wake up early for meditation and prayer. Even 15-20 minutes can transform your entire day.'
        }
      ]
    };
  }

  createSampleKathakars() {
    this.kathakars = [
      {
        name: 'Giani Pinderpal Singh',
        specializations: ['work_professional', 'modern_challenges'],
        teaching_style: 'Practical application of Gurbani to modern workplace challenges',
        sample_teachings: {
          work_professional: 'In the corporate world, remember that success comes through honest effort combined with divine grace. Work with full dedication but remain detached from outcomes.',
          general: 'Gurbani provides practical solutions for all modern challenges when applied with understanding.'
        }
      },
      {
        name: 'Giani Sarabjit Singh Dhunda',
        specializations: ['technology_balance', 'youth_guidance'],
        teaching_style: 'Contemporary interpretation focusing on digital age challenges',
        sample_teachings: {
          technology_balance: 'Social media and technology are tools - use them wisely without letting them control your mind and spiritual practice.',
          general: 'Young people today face unique challenges that require both traditional wisdom and modern understanding.'
        }
      }
    ];
  }

  async classifyIntent(userMessage) {
    const prompt = `
Classify this spiritual question into ONE primary category:

Categories:
1. work_professional - Career stress, workplace ethics, job challenges
2. family_relationships - Parent/child issues, marriage, family conflicts  
3. mental_wellness - Anxiety, depression, stress, emotional struggles
4. technology_balance - Social media addiction, digital overwhelm
5. spiritual_practice - Meditation, prayer, spiritual growth
6. community_service - Seva opportunities, helping others
7. personal_growth - Character development, bad habits, self-improvement
8. life_transitions - Major life changes, decisions, uncertainty
9. health_healing - Physical/mental health, illness, recovery
10. financial_guidance - Money stress, career decisions, financial ethics

User message: "${userMessage}"

Respond with just the category name and confidence score (0-1):
Format: category_name|confidence_score
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.3
      });

      const result = response.choices[0].message.content.trim();
      const [category, confidence] = result.split('|');
      
      return {
        category: category.trim(),
        confidence: parseFloat(confidence) || 0.8
      };
    } catch (error) {
      console.error('Error classifying intent:', error);
      // Fallback classification based on keywords
      const message_lower = userMessage.toLowerCase();
      
      if (message_lower.includes('work') || message_lower.includes('job') || message_lower.includes('boss')) {
        return { category: 'work_professional', confidence: 0.7 };
      } else if (message_lower.includes('family') || message_lower.includes('parent') || message_lower.includes('son') || message_lower.includes('daughter')) {
        return { category: 'family_relationships', confidence: 0.7 };
      } else if (message_lower.includes('stress') || message_lower.includes('anxious') || message_lower.includes('depressed')) {
        return { category: 'mental_wellness', confidence: 0.7 };
      } else {
        return { category: 'spiritual_practice', confidence: 0.5 };
      }
    }
  }

  findRelevantGurbani(category, limit = 3) {
    if (!this.gurbaniData || !this.gurbaniData[category]) {
      console.log(`⚠️ No data found for category: ${category}`);
      return [];
    }

    let verses = this.gurbaniData[category];
    
    // Return top verses (already curated in our manual database)
    return verses.slice(0, limit).map(verse => ({
      gurmukhi: verse.gurmukhi,
      pronunciation: verse.pronunciation,
      translation: verse.translation,
      ang: verse.ang,
      raag: verse.raag,
      author: verse.author,
      modern_context: verse.modern_context || '',
      practical_advice: verse.practical_advice || ''
    }));
  }

  findRelevantKathakar(category) {
    if (!this.kathakars) return null;

    // Find kathakar most relevant to this category
    const relevantKathakar = this.kathakars.find(k => 
      k.specializations && k.specializations.includes(category)
    ) || this.kathakars[0]; // Default to first if none match

    return {
      name: relevantKathakar.name,
      teaching: relevantKathakar.sample_teachings?.[category] || relevantKathakar.sample_teachings?.general,
      approach: relevantKathakar.teaching_style,
      specialization: relevantKathakar.specializations?.join(', ')
    };
  }

  async generateResponse(userMessage, intent, gurbaniVerses, kathakarWisdom) {
    const systemPrompt = `
You are a Sikh spiritual guide providing authentic guidance based on Gurbani and contemporary Sikh teachings.

Structure your response with these elements:
1. GREETING: Start with "Waheguru ji ka Khalsa, Waheguru ji ki Fateh!"
2. EMPATHY: Acknowledge the person's situation with understanding
3. GURBANI FOUNDATION: Present relevant verse(s) with translation
4. KATHAKAR WISDOM: Share contemporary teaching that applies
5. PRACTICAL GUIDANCE: Give specific, actionable steps
6. ENCOURAGEMENT: Offer hope and motivation
7. BLESSING: End with a prayer or blessing

Guidelines:
- Use authentic Sikh terminology appropriately
- Be compassionate and understanding
- Provide practical, actionable advice
- Reference specific Guru examples when relevant
- Keep response length moderate (300-500 words)
- Maintain spiritual depth while being accessible
`;

    const userPrompt = `
User's question: "${userMessage}"
Intent category: ${intent.category}

Relevant Gurbani verses:
${gurbaniVerses.map(v => `
Gurmukhi: ${v.gurmukhi}
Pronunciation: ${v.pronunciation}
Translation: ${v.translation}
Source: Ang ${v.ang}, ${v.raag} by ${v.author}
Modern Context: ${v.modern_context}
Practical Advice: ${v.practical_advice}
`).join('\n')}

Kathakar wisdom:
From ${kathakarWisdom?.name}: ${kathakarWisdom?.teaching}

Generate a complete spiritual guidance response following the 7-element structure.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response:', error);
      return this.getFallbackResponse(userMessage, gurbaniVerses[0]);
    }
  }

  getFallbackResponse(userMessage = '', verse = null) {
    const verseText = verse ? `

Here is relevant Gurbani to reflect upon:
"${verse.gurmukhi}"
"${verse.translation}"
- Ang ${verse.ang}, ${verse.raag} by ${verse.author}` : '';

    return `
Waheguru ji ka Khalsa, Waheguru ji ki Fateh!

I understand you're seeking spiritual guidance. While I'm having some technical difficulties right now, I want you to know that Guru ji's wisdom is always available to guide us.

The fundamental teaching of our Gurus is:
"ਸਰਬ ਰੋਗ ਕਾ ਔਖਦੁ ਨਾਮੁ"
"Naam is the medicine for all ailments."

Whatever challenge you're facing, turning to Naam Simran, connecting with Sangat, and following the Guru's path will provide clarity and strength.${verseText}

Please try asking your question again, and I'll do my best to provide specific Gurbani-based guidance.

Waheguru ji mehar karan.
`;
  }

  async processUserQuery(userMessage) {
    try {
      console.log(`🔄 Processing query: "${userMessage}"`);
      
      // Step 1: Classify intent
      const intent = await this.classifyIntent(userMessage);
      console.log(`📝 Intent: ${intent.category} (confidence: ${intent.confidence})`);
      
      // Step 2: Find relevant Gurbani
      const gurbaniVerses = this.findRelevantGurbani(intent.category);
      console.log(`📖 Found ${gurbaniVerses.length} relevant verses`);
      
      // Step 3: Get kathakar wisdom
      const kathakarWisdom = this.findRelevantKathakar(intent.category);
      console.log(`👨‍🏫 Kathakar: ${kathakarWisdom?.name || 'None'}`);
      
      // Step 4: Generate complete response
      const response = await this.generateResponse(userMessage, intent, gurbaniVerses, kathakarWisdom);
      
      return {
        response,
        metadata: {
          intent,
          gurbaniVerses,
          kathakarWisdom,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('Error processing user query:', error);
      return {
        response: this.getFallbackResponse(userMessage),
        metadata: { error: error.message }
      };
    }
  }

  // Test method for development
  testSystem() {
    console.log('🧪 Testing Gurbani AI System...');
    console.log('📊 Available categories:', Object.keys(this.gurbaniData || {}));
    console.log('👨‍🏫 Available kathakars:', this.kathakars?.map(k => k.name) || []);
    
    Object.keys(this.gurbaniData || {}).forEach(category => {
      const verses = this.gurbaniData[category];
      console.log(`   ${category}: ${verses.length} verses`);
    });
  }
}

module.exports = GurbaniAI;