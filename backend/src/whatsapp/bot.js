const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chatHandler = require('../ai-processing/chatHandler');

class WhatsAppBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: process.env.WHATSAPP_SESSION_NAME || 'gurbani-guide-session'
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // QR Code for initial authentication
    this.client.on('qr', (qr) => {
      console.log('📱 WhatsApp QR Code:');
      qrcode.generate(qr, { small: true });
      console.log('Scan this QR code with your WhatsApp to connect the bot.');
    });

    // Client ready
    this.client.on('ready', () => {
      console.log('✅ WhatsApp bot is ready and connected!');
    });

    // Handle incoming messages
    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });

    // Handle authentication failure
    this.client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp authentication failed:', msg);
    });

    // Handle disconnection
    this.client.on('disconnected', (reason) => {
      console.log('❌ WhatsApp bot disconnected:', reason);
    });
  }

  async handleMessage(message) {
    try {
      // Skip group messages and messages from self
      if (message.from.includes('@g.us') || message.fromMe) {
        return;
      }

      // Skip non-text messages for now
      if (message.type !== 'chat') {
        await message.reply('🙏 I currently only respond to text messages. Please send your spiritual question as text.');
        return;
      }

      // Show typing indicator
      await message.reply('🙏 Let me find guidance from Gurbani for you...');

      // Process the spiritual question
      const response = await chatHandler.processMessage({
        message: message.body,
        userId: message.from,
        context: {
          whatsapp: true,
          contact: message._data.notifyName || 'Unknown'
        }
      });

      // Format response for WhatsApp
      const formattedResponse = this.formatResponse(response);
      
      // Send response
      await message.reply(formattedResponse);

      // If there are sources, send them as a follow-up
      if (response.sources && response.sources.length > 0) {
        const sourcesText = this.formatSources(response.sources);
        await message.reply(sourcesText);
      }

    } catch (error) {
      console.error('WhatsApp message handling error:', error);
      await message.reply('🙏 I apologize, but I encountered an issue while processing your question. Please try asking again.');
    }
  }

  formatResponse(response) {
    let formatted = `🙏 *Spiritual Guidance* 🙏\n\n`;
    formatted += response.text;
    
    if (response.verses && response.verses.length > 0) {
      formatted += '\n\n📖 *Relevant Gurbani:*\n';
      response.verses.slice(0, 2).forEach((verse, index) => {
        formatted += `\n${index + 1}. ${verse.gurmukhi}\n`;
        formatted += `   _${verse.english_translation}_\n`;
        formatted += `   (${verse.reference})\n`;
      });
    }

    return formatted;
  }

  formatSources(sources) {
    let formatted = '📚 *Sources:*\n\n';
    
    sources.slice(0, 5).forEach((source, index) => {
      if (source.type === 'gurbani') {
        formatted += `${index + 1}. Sri Guru Granth Sahib Ji - ${source.reference}\n`;
      } else if (source.type === 'katha') {
        formatted += `${index + 1}. Katha by ${source.scholar}\n`;
      } else if (source.type === 'historical') {
        formatted += `${index + 1}. ${source.title}\n`;
      }
    });

    formatted += '\n_All responses are based on authentic Sikh sources._';
    return formatted;
  }

  async start() {
    try {
      console.log('🚀 Starting WhatsApp bot...');
      await this.client.initialize();
    } catch (error) {
      console.error('Failed to start WhatsApp bot:', error);
    }
  }

  async stop() {
    try {
      await this.client.destroy();
      console.log('✅ WhatsApp bot stopped successfully');
    } catch (error) {
      console.error('Error stopping WhatsApp bot:', error);
    }
  }

  // Send broadcast message to multiple contacts
  async sendBroadcast(contacts, message) {
    try {
      for (const contact of contacts) {
        await this.client.sendMessage(contact, message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }
    } catch (error) {
      console.error('Broadcast error:', error);
    }
  }
}

module.exports = WhatsAppBot;
