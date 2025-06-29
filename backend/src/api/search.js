const express = require('express');
const router = express.Router();
const searchEngine = require('../ai-processing/searchEngine');

// Semantic search across all content
router.get('/', async (req, res) => {
  try {
    const { query, type = 'all', limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await searchEngine.semanticSearch({
      query,
      contentType: type,
      limit: parseInt(limit)
    });

    res.json({
      query,
      type,
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search within specific katha content
router.get('/katha/:scholar', async (req, res) => {
  try {
    const { scholar } = req.params;
    const { query, limit = 5 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await searchEngine.searchKatha(scholar, query, parseInt(limit));

    res.json({
      scholar,
      query,
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Katha search error:', error);
    res.status(500).json({ error: 'Katha search failed' });
  }
});

// Search historical content and sakhis
router.get('/historical', async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await searchEngine.searchHistorical(query, parseInt(limit));

    res.json({
      query,
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Historical search error:', error);
    res.status(500).json({ error: 'Historical search failed' });
  }
});

module.exports = router;
