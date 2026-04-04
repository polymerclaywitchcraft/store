import { NextRequest, NextResponse } from 'next/server';
import { Bot } from 'grammy';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderFormData {
  email: string;
  instagram: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface Order {
  cart: CartItem[];
  formData: OrderFormData;
}

export async function POST(request: NextRequest) {
  let body: Order;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const token = process.env.TELEGRAM_TOKEN || '';
  const channelId = process.env.TELEGRAM_CHANNEL_ID || '';

  if (!token || !channelId) {
    console.error('Telegram credentials are not configured');
    return NextResponse.json(
      { error: 'Telegram credentials are not configured' },
      { status: 500 }
    );
  }

  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  try {
    const bot = new Bot(token);

    const items = body.cart.map(
      (item) =>
        `${item.quantity}x ${escapeHtml(item.name)} - ${Number(item.price)}€`
    );
    const { firstName, lastName, email, instagram } = body.formData;
    const textMessage = `New order from ${escapeHtml(firstName)} ${escapeHtml(lastName)} (${escapeHtml(email)} / ${escapeHtml(instagram)})\n\n ${items.join('\n')}`;

    const rawData = JSON.stringify(body, null, 2);

    const tgMessage = await bot.api.sendMessage(channelId, textMessage, {
      parse_mode: 'HTML',
    });

    await bot.api.sendMessage(channelId, rawData, {
      parse_mode: 'HTML',
      reply_to_message_id: tgMessage.message_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
