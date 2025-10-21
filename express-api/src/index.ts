import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}
const stripe = new Stripe(stripeSecretKey);

const app = express();
const port = process.env['PORT'] || 4000;

app.use(cors());
app.use(express.json());

interface Item {
  name: string;
  price: number;
  qty: number;
}

app.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items array' });
    }

    const lineItems = (items as Item[]).map((item: Item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const origin = req.headers.origin || process.env['BASE_URL'] || 'https://crzyrabbit.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    console.log("✅ Stripe session created:", session.id);
    return res.status(200).json({ id: session.id });

  } catch (err) {
    console.error('❌ Stripe Checkout Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
