import { NextRequest, NextResponse } from 'next/server';
import { cancelPayPalSubscription } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agreementId, reason, clientId, clientSecret } = body;

    if (!agreementId) {
      return NextResponse.json({ error: 'agreementId is required' }, { status: 400 });
    }

    const result = await cancelPayPalSubscription(
      agreementId,
      reason || 'AgentVault automated subscription audit',
      clientId,
      clientSecret
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'PayPal subscription cancellation failed' },
      { status: 500 }
    );
  }
}
