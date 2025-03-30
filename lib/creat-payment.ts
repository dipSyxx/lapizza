import { PaymentData } from '@/@types/stripe';
import axios from 'axios';

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

export async function createPayment(details: Props) {
  const { data } = await axios.post<PaymentData>(
    'https://api.stripe.com/v1/payments',
    {
      amount: {
        value: details.amount.toString(),
        currency: 'usd',
      },
      capture: true,
      description: details.description,
      metadata: {
        order_id: details.orderId,
      },
      confirmation: {
        type: 'redirect',
        return_url: process.env.STRIPE_CALLBACK_URL,
      },
    },
    {
      auth: {
        username: process.env.STRIPE_SECRET_KEY as string,
        password: '',
      },
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': Math.random().toString(36).substring(7),
      },
    },
  );

  return data;
}
