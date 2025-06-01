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

// Post message to Telegram channel
export async function postToChannel(channelId: string, message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting to channel:', error);
    throw error;
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