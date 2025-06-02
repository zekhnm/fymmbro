// Function to initialize Telegram WebApp
export function initTelegramWebApp() {
  // Check if Telegram WebApp is available
  if (typeof window !== 'undefined' && 'Telegram' in window && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // Expand the WebApp to fullscreen
    webApp.expand();
    
    // Set the header color
    webApp.setHeaderColor('#FF5722');
    
    // Set the background color
    webApp.setBackgroundColor('#FFFFFF');
    
    return webApp;
  }
  
  return null;
}

// Get user data from Telegram WebApp
export function getTelegramUser() {
  if (typeof window !== 'undefined' && 'Telegram' in window && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    
    // Check if initDataUnsafe is available and has user data
    if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
      return webApp.initDataUnsafe.user;
    }
  }
  
  // Return mock user for development
  if (process.env.NODE_ENV === 'development') {
    return {
      id: '12345678',
      first_name: 'Dev',
      last_name: 'User',
      username: 'devuser',
      language_code: 'en'
    };
  }
  
  return null;
}

// Post message to Telegram channel with retry mechanism
export async function postToChannel(channelId: string, message: string, retries = 2): Promise<void> {
  // Validate inputs
  if (!channelId || !channelId.startsWith('-100')) {
    console.error('Invalid channel ID:', channelId);
    throw new Error('Invalid Telegram channel ID');
  }

  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('Telegram bot token is not configured');
    throw new Error('Telegram bot token is not configured');
  }

  // Format message for Markdown (safer than HTML)
  const formattedMessage = message.replace(/✨|💰|🕹️|⚡/g, '*'); // Replace emojis with Markdown-safe characters

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: formattedMessage,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();

      if (!data.ok) {
        console.error(`Telegram API error (attempt ${attempt}):`, data);
        throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
      }

      console.log('Message posted to channel successfully:', data);
      return;
    } catch (error) {
      console.error(`Error posting to channel (attempt ${attempt}):`, error);
      if (attempt <= retries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      throw error; // Rethrow after final attempt
    }
  }
}

// Create shareable invite link
export function createInviteLink(referrerId: string) {
  const botUsername = 'itGuessBot'; // Your bot username
  return `https://t.me/${botUsername}?start=ref_${referrerId}`;
}

// Share invite link via Telegram
export function shareInviteLink(inviteLink: string, text: string) {
  if (typeof window !== 'undefined' && 'Telegram' in window && window.Telegram?.WebApp) {
    window.Telegram.WebApp.switchInlineQuery(text, ['users', 'groups']);
  }
}

// Add Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void;
        enableClosingConfirmation: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initDataUnsafe: {
          user?: {
            id: string;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code: string;
          };
        };
        switchInlineQuery: (text: string, targets: string[]) => void;
      };
    };
  }
}
