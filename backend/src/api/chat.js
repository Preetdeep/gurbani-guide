const express = require('express');
const router = express.Router();
const aiProcessor = require('../ai-processing/chatHandler');

// Process chat messages
router.post('/', async (req, res) => {
  try {
    const { message, userId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiProcessor.processMessage({
      message,
      userId: userId || 'anonymous',
      context: context || {}
    });

    res.json({
      response: response.text,
      sources: response.sources,
      verses: response.verses,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get conversation history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    // TODO: Implement conversation history retrieval
    res.json({
      conversations: [],
      message: 'History feature coming soon'
    });

  } catch (error) {
    console.error('History API error:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

module.exports = router;
