import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.basil',
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { items } = request.body;

  if (!items) {
    return response.status(400).json({ error: 'Missing items' });
  }

  const line_items = items.map((item: any) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${request.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.headers.origin}/cancel`,
  });

  response.status(200).json({ id: session.id });
}
