#!/usr/bin/env node

/**
 * WhatsApp Bot Starter Script
 * This script initializes and starts the WhatsApp bot
 */

const WhatsAppBot = require('../backend/src/whatsapp/bot');

async function startBot() {
  console.log('🚀 Initializing Gurbani Guide WhatsApp Bot...');
  
  const bot = new WhatsAppBot();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
    await bot.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
    await bot.stop();
    process.exit(0);
  });

  // Start the bot
  await bot.start();
}

if (require.main === module) {
  startBot().catch(error => {
    console.error('❌ Failed to start WhatsApp bot:', error);
    process.exit(1);
  });
}

module.exports = { startBot };
