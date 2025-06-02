// bot.js - Run this separately on a server
const { Telegraf } = require('telegraf');

// Initialize the bot with the token
const bot = new Telegraf('7385463835:AAEgsPeUzC9iJy_KcNxttzpi5Uxthjl9P7E');

// Set the mini app URL
const MINI_APP_URL = 'https://olive-drab-valuation.hellofine.dev';

// Handle /start command
bot.start((ctx) => {
  // Check if this is a referral
  const startPayload = ctx.startPayload;
  let referralId = null;
  
  if (startPayload && startPayload.startsWith('ref_')) {
    referralId = startPayload.substring(4);
    console.log(`User referred by: ${referralId}`);
    // You would handle the referral in your database here
  }
  
  // Send welcome message with inline button to launch mini app
  ctx.reply('Welcome to Gue$$it!', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '▶️ Play', web_app: { url: MINI_APP_URL } }]
      ]
    }
  });
});

// Handle /help command
bot.help((ctx) => {
  ctx.reply(`
Gue$$it - Guess country flags and earn real money!

How to play:
1. Tap the Play button to start
2. Guess the country flag correctly to earn ₱28
3. You get 2 guesses per day
4. Invite 8 friends to get unlimited guesses
5. Withdraw your earnings via GCash (min ₱150)

Need more help? Check the FAQ section in the app.
  `);
});

// Start the bot
bot.launch()
  .then(() => {
    console.log(`Bot @itGuessBot is running!`);
  })
  .catch((err) => {
    console.error('Error starting bot:', err);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
