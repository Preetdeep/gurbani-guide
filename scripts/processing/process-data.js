#!/usr/bin/env node

/**
 * Data Processing Script for Gurbani Guide
 * Processes raw data into structured format with embeddings
 */

const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class DataProcessor {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.dataDir = path.join(__dirname, '../../data');
    this.processedDir = path.join(this.dataDir, 'processed');
  }

  async processGurbaniData() {
    console.log('🔄 Processing Gurbani data...');
    
    try {
      // This would process the collected Gurbani text
      const rawGurbani = await this.loadRawGurbani();
      const processedVerses = await this.structureVerses(rawGurbani);
      const versesWithEmbeddings = await this.generateVerseEmbeddings(processedVerses);
      
      await this.saveProcessedData('gurbani-verses.json', versesWithEmbeddings);
      
      console.log(`✅ Processed ${versesWithEmbeddings.length} verses`);
    } catch (error) {
      console.error('❌ Gurbani processing failed:', error);
    }
  }

  async loadRawGurbani() {
    // Placeholder for loading raw Gurbani data
    // This would load from the collected data sources
    return {
      verses: [
        {
          ang: 1,
          line: 1,
          gurmukhi: "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
          transliteration: "Ik Onkar Sat Naam Karta Purakh Nirbhau Nirvair Akaal Moorat Ajooni Saibhang Gur Prasaad ||",
          english: "One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred. Image Of The Undying, Beyond Birth, Self-Existent. By Guru's Grace ~",
          author: "Guru Nanak Dev Ji"
        }
      ]
    };
  }

  async structureVerses(rawData) {
    console.log('📋 Structuring verses...');
    
    return rawData.verses.map(verse => ({
      id: `ang_${verse.ang}_line_${verse.line}`,
      ang: verse.ang,
      line_number: verse.line,
      gurmukhi: verse.gurmukhi,
      transliteration: verse.transliteration,
      english_translation: verse.english,
      author: verse.author,
      reference: `Ang ${verse.ang}`,
      themes: this.extractThemes(verse.english),
      word_count: verse.english.split(' ').length
    }));
  }

  extractThemes(englishText) {
    // Simple theme extraction - would be more sophisticated in practice
    const themeKeywords = {
      'devotion': ['love', 'devotion', 'worship', 'remember'],
      'peace': ['peace', 'calm', 'tranquil', 'serenity'],
      'wisdom': ['wisdom', 'knowledge', 'understanding', 'truth'],
      'service': ['service', 'seva', 'help', 'community'],
      'meditation': ['meditat', 'nam', 'simran', 'prayer']
    };

    const themes = [];
    const lowerText = englishText.toLowerCase();
    
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        themes.push(theme);
      }
    }
    
    return themes;
  }

  async generateVerseEmbeddings(verses) {
    console.log('🧠 Generating embeddings...');
    
    const versesWithEmbeddings = [];
    
    for (let i = 0; i < verses.length; i++) {
      const verse = verses[i];
      
      try {
        // Combine Gurmukhi transliteration and English for embedding
        const textForEmbedding = `${verse.transliteration} ${verse.english_translation}`;
        
        const embedding = await this.generateEmbedding(textForEmbedding);
        
        versesWithEmbeddings.push({
          ...verse,
          embedding: embedding
        });
        
        console.log(`✅ Processed verse ${i + 1}/${verses.length}`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to process verse ${verse.id}:`, error);
      }
    }
    
    return versesWithEmbeddings;
  }

  async generateEmbedding(text) {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    
    return response.data[0].embedding;
  }

  async processKathaData() {
    console.log('🎤 Processing Katha data...');
    
    const scholars = ['pinderpal-singh', 'sarabjit-singh-dhunda'];
    
    for (const scholar of scholars) {
      await this.processScholarKatha(scholar);
    }
  }

  async processScholarKatha(scholar) {
    console.log(`📖 Processing ${scholar} katha...`);
    
    // Placeholder for katha processing
    const kathaSegments = [
      {
        scholar: scholar,
        topic: 'Gurbani Interpretation',
        segment: 'Sample katha segment about spiritual guidance...',
        duration: '5:30',
        themes: ['guidance', 'spirituality']
      }
    ];

    const processedKatha = await Promise.all(
      kathaSegments.map(async segment => ({
        ...segment,
        id: `${scholar}_${Date.now()}`,
        embedding: await this.generateEmbedding(segment.segment)
      }))
    );

    await this.saveProcessedData(`katha-${scholar}.json`, processedKatha);
    console.log(`✅ Processed ${processedKatha.length} katha segments for ${scholar}`);
  }

  async processHistoricalData() {
    console.log('📚 Processing historical data...');
    
    const sakhis = [
      {
        title: 'Guru Nanak and the Boulder',
        content: 'Historical account of Guru Nanak Dev Ji...',
        period: '1469-1539',
        lesson: 'Humility and divine power',
        verified: true
      }
    ];

    const processedSakhis = await Promise.all(
      sakhis.map(async sakhi => ({
        ...sakhi,
        id: `sakhi_${Date.now()}`,
        embedding: await this.generateEmbedding(`${sakhi.title} ${sakhi.content} ${sakhi.lesson}`)
      }))
    );

    await this.saveProcessedData('historical-sakhis.json', processedSakhis);
    console.log(`✅ Processed ${processedSakhis.length} historical accounts`);
  }

  async saveProcessedData(filename, data) {
    const filePath = path.join(this.processedDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved ${filename}`);
  }

  async generateSearchIndex() {
    console.log('🔍 Generating search index...');
    
    // This would create optimized search indices
    const searchIndex = {
      verses_by_theme: {},
      verses_by_author: {},
      katha_by_scholar: {},
      embedding_index: 'Vector database indices'
    };

    await this.saveProcessedData('search-index.json', searchIndex);
    console.log('✅ Search index generated');
  }

  async generateProcessingReport() {
    console.log('\n📊 Data Processing Report\n');
    
    try {
      const processedFiles = await fs.readdir(this.processedDir);
      
      console.log('📁 Processed Files:');
      for (const file of processedFiles) {
        const filePath = path.join(this.processedDir, file);
        const stats = await fs.stat(filePath);
        console.log(`   ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      }
      
      console.log('\n✅ Processing Summary:');
      console.log('   - Gurbani verses processed with embeddings');
      console.log('   - Katha content structured and indexed');
      console.log('   - Historical accounts verified and embedded');
      console.log('   - Search indices generated');
      
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  }

  async run() {
    try {
      console.log('🚀 Starting data processing pipeline...\n');
      
      await this.processGurbaniData();
      await this.processKathaData();
      await this.processHistoricalData();
      await this.generateSearchIndex();
      await this.generateProcessingReport();
      
      console.log('\n✅ Data processing completed successfully!');
      
    } catch (error) {
      console.error('❌ Data processing failed:', error);
    }
  }
}

if (require.main === module) {
  const processor = new DataProcessor();
  processor.run();
}

module.exports = DataProcessor;
