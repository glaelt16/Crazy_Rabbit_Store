import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.basil',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // ✅ Parse request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('🛒 Incoming cart body:', body);

    // ✅ Validate items
    if (!body?.items || !Array.isArray(body.items)) {
      return res.status(400).json({ error: 'Invalid cart items format' });
    }

    // ✅ Transform items into Stripe line_items
    const lineItems = body.items.map((item: any) => {
      if (!item.name || !item.price || !item.qty) {
        throw new Error('Missing required fields (name, price, qty) in cart item');
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // convert to cents
        },
        quantity: item.qty, // 👈 map qty → quantity
      };
    });

    // ✅ Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    console.log('✅ Stripe checkout session created:', session.id);

    // ✅ Respond with session URL for redirect
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('❌ Checkout API Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
