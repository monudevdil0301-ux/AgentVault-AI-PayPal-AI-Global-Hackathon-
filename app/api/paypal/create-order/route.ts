import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, description, clientId, clientSecret } = body;

    const result = await createPayPalOrder(
      { amount: parseFloat(amount) || 10, currency, description },
      clientId,
      clientSecret
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'PayPal order creation error' },
      { status: 500 }
    );
  }
}
