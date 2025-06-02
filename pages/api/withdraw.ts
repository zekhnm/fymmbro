import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; // or global fetch in Node 18+
import { fine } from '@/lib/fine'; // adjust path to your DB instance

const TELEGRAM_BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '-1002592525628';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId, amountInCentavos, gcashNumber } = req.body;

  if (!userId || !amountInCentavos || !gcashNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert withdrawal record
    await fine.table('withdrawals').insert({
      userId,
      amount: amountInCentavos,
      gcashNumber,
    });

    // Get user
    const users = await fine.table('users').select().eq('id', userId);
    if (!users || users.length === 0) {
      throw new Error('User not found');
    }
    const currentUser = users[0];
    const newBalance = (currentUser.balance || 0) - amountInCentavos;

    // Update user balance
    await fine.table('users').update({ balance: newBalance }).eq('id', userId);

    // Send Telegram message
    const message = `✨ New withdrawal success\n\n💰 Amount Withdrawn: ₱${(amountInCentavos / 100).toFixed(2)}\n\n🕹️ Via: GCash\n\n⚡ @itGuessBot`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const telegramData = await telegramResponse.json();
    if (!telegramData.ok) {
      console.error('Telegram API error:', telegramData);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Withdrawal API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
