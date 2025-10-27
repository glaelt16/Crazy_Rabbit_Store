import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-09-30.clover',
});

const app = express();
const port = process.env['PORT'] || 4000;

app.use(cors());
app.use(express.json());

interface Item {
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: { name: string };
}

app.post('/api/checkout', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items array' });
    }

    const lineItems = (items as Item[]).map((item: Item) => {
      const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
        name: item.name,
      };

      const descriptionParts = [];
      if (item.color) {
        descriptionParts.push(`Color: ${item.color.name}`);
      }
      if (item.size) {
        descriptionParts.push(`Size: ${item.size}`);
      }
      if (descriptionParts.length > 0) {
        productData.description = descriptionParts.join(' - ');
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      };
    });

    const origin = req.headers.origin || process.env['BASE_URL'] || 'https://crzyrabbit.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      automatic_tax: {
        enabled: true,
      },
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
