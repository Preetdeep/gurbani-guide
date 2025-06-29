const supabase = require('../database/supabase');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class SearchEngine {
  async semanticSearch({ query, contentType = 'all', limit = 10 }) {
    try {
      const embedding = await this.generateEmbedding(query);
      
      const searchPromises = [];

      // Search different content types based on request
      if (contentType === 'all' || contentType === 'gurbani') {
        searchPromises.push(this.searchGurbaniContent(embedding, limit));
      }

      if (contentType === 'all' || contentType === 'katha') {
        searchPromises.push(this.searchKathaContent(embedding, limit));
      }

      if (contentType === 'all' || contentType === 'historical') {
        searchPromises.push(this.searchHistoricalContent(embedding, limit));
      }

      const results = await Promise.all(searchPromises);
      
      // Combine and sort results by relevance
      const combinedResults = results.flat().sort((a, b) => b.similarity - a.similarity);
      
      return combinedResults.slice(0, limit);
    } catch (error) {
      console.error('Semantic search error:', error);
      return [];
    }
  }

  async searchGurbaniContent(embedding, limit) {
    try {
      const { data, error } = await supabase
        .rpc('search_gurbani_semantic', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        type: 'gurbani'
      }));
    } catch (error) {
      console.error('Gurbani content search error:', error);
      return [];
    }
  }

  async searchKathaContent(embedding, limit) {
    try {
      const { data, error } = await supabase
        .rpc('search_katha_semantic', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        type: 'katha'
      }));
    } catch (error) {
      console.error('Katha content search error:', error);
      return [];
    }
  }

  async searchHistoricalContent(embedding, limit) {
    try {
      const { data, error } = await supabase
        .rpc('search_historical_semantic', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        type: 'historical'
      }));
    } catch (error) {
      console.error('Historical content search error:', error);
      return [];
    }
  }

  async searchKatha(scholar, query, limit = 5) {
    try {
      const embedding = await this.generateEmbedding(query);
      
      const { data, error } = await supabase
        .rpc('search_scholar_katha', {
          scholar_name: scholar,
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Scholar katha search error:', error);
      return [];
    }
  }

  async searchAllKatha(query, limit = 5) {
    try {
      const embedding = await this.generateEmbedding(query);
      
      const { data, error } = await supabase
        .rpc('search_all_katha', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('All katha search error:', error);
      return [];
    }
  }

  async searchHistorical(query, limit = 5) {
    try {
      const embedding = await this.generateEmbedding(query);
      
      const { data, error } = await supabase
        .rpc('search_historical_content', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Historical search error:', error);
      return [];
    }
  }

  async searchSakhis(query, limit = 3) {
    try {
      const embedding = await this.generateEmbedding(query);
      
      const { data, error } = await supabase
        .rpc('search_sakhis', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: limit
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Sakhi search error:', error);
      return [];
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

  async findRelevantSources(query, maxSources = 10) {
    const results = await this.semanticSearch({
      query,
      contentType: 'all',
      limit: maxSources
    });

    // Group by source type and prioritize Gurbani
    const grouped = {
      gurbani: results.filter(r => r.type === 'gurbani').slice(0, 5),
      katha: results.filter(r => r.type === 'katha').slice(0, 3),
      historical: results.filter(r => r.type === 'historical').slice(0, 2)
    };

    return grouped;
  }
}

module.exports = new SearchEngine();
