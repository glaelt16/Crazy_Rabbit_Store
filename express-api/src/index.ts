import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

// Twilio Configuration
const twilioAccountSid = process.env['TWILIO_ACCOUNT_SID'];
const twilioAuthToken = process.env['TWILIO_AUTH_TOKEN'];
const twilioPhoneNumber = process.env['TWILIO_PHONE_NUMBER'];

if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
  throw new Error('Twilio environment variables are not fully set');
}

const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

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

    // Map items to Stripe line items format
    const lineItems = (items as Item[]).map((item: Item) => {
      const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
        name: item.name,
        tax_code: 'txcd_99999999',
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
          tax_behavior: 'exclusive',
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

    // Send SMS notification
    try {
      const message = await twilioClient.messages.create({
        body: `New order received! Total: $${(session.amount_total! / 100).toFixed(2)}.`,
        from: twilioPhoneNumber,
        to: '+13056074557'
      });
      console.log("✅ SMS notification sent:", message.sid);
    } catch (smsError) {
      console.error('❌ Error sending SMS:', smsError);
      // Do not block the checkout flow if SMS fails
    }

    return res.status(200).json({ id: session.id });

  } catch (err) {
    console.error('❌ Stripe Checkout Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/notify-amazon-click', async (req: Request, res: Response) => {
  try {
    const { productName } = req.body;
    const messageBody = productName
      ? `An Amazon link for the product "${productName}" was just clicked.`
      : 'An Amazon link was just clicked.';

    const message = await twilioClient.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: '+13056074557'
    });
    console.log("✅ SMS for Amazon link click sent:", message.sid);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error sending Amazon link SMS:', err);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
