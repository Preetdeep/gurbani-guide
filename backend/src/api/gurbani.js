const express = require('express');
const router = express.Router();
const gurbaniSearch = require('../ai-processing/gurbaniSearch');

// Search Gurbani verses
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await gurbaniSearch.searchVerses(query, parseInt(limit));

    res.json({
      query,
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Gurbani search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get random verse for inspiration
router.get('/daily', async (req, res) => {
  try {
    const dailyVerse = await gurbaniSearch.getDailyVerse();

    res.json({
      verse: dailyVerse,
      date: new Date().toISOString().split('T')[0]
    });

  } catch (error) {
    console.error('Daily verse error:', error);
    res.status(500).json({ error: 'Failed to get daily verse' });
  }
});

// Get verse by specific reference
router.get('/verse/:ang/:line?', async (req, res) => {
  try {
    const { ang, line } = req.params;
    
    const verse = await gurbaniSearch.getVerseByReference(
      parseInt(ang), 
      line ? parseInt(line) : null
    );

    if (!verse) {
      return res.status(404).json({ error: 'Verse not found' });
    }

    res.json({ verse });

  } catch (error) {
    console.error('Verse lookup error:', error);
    res.status(500).json({ error: 'Failed to get verse' });
  }
});

module.exports = router;
