import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}
 const stripe = new Stripe(stripeSecretKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    interface Item {
      name: string;
      price: number;
      qty: number;
    }

    if (!body.items || !Array.isArray(body.items)) {
  return res.status(400).json({ error: 'Invalid items array' });
}

    const lineItems = (body.items as Item[]).map((item: Item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));


    const origin = req.headers.origin || process.env.BASE_URL || 'https://crzyrabbit.com';
 
      
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });


    console.log("✅ Stripe session created:", session.id);

    console.log('🧠 Incoming body:', body);

    return res.status(200).json({ id: session.id });

  } catch (err) {
    console.error('❌ Stripe Checkout Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}
