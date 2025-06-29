const express = require('express');
const router = express.Router();
const chatHandler = require('../ai-processing/chatHandler');

// Webhook for WhatsApp Business API (if using cloud API instead of web.js)
router.post('/', async (req, res) => {
  try {
    const { body } = req;

    // Verify webhook (required by WhatsApp)
    if (body.object) {
      if (body.entry && 
          body.entry[0].changes && 
          body.entry[0].changes[0].value.messages && 
          body.entry[0].changes[0].value.messages[0]) {
        
        const message = body.entry[0].changes[0].value.messages[0];
        const phoneNumber = message.from;
        const messageText = message.text.body;

        // Process the message
        const response = await chatHandler.processMessage({
          message: messageText,
          userId: phoneNumber,
          context: {
            whatsapp_business: true,
            webhook: true
          }
        });

        // Send response back via WhatsApp Business API
        await sendWhatsAppMessage(phoneNumber, response.text);

        res.status(200).send('EVENT_RECEIVED');
      } else {
        res.status(404).send('EVENT_NOT_SUPPORTED');
      }
    } else {
      res.status(404).send('EVENT_NOT_SUPPORTED');
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('INTERNAL_ERROR');
  }
});

// Webhook verification (GET request)
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WhatsApp webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('VERIFICATION_FAILED');
    }
  } else {
    res.status(403).send('MISSING_PARAMETERS');
  }
});

// Function to send message via WhatsApp Business API
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    // This would integrate with WhatsApp Business API
    // Implementation depends on your chosen provider (Meta, Twilio, etc.)
    console.log(`Sending to ${phoneNumber}: ${message}`);
    
    // TODO: Implement actual API call to WhatsApp Business API
    
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
  }
}

module.exports = router;
