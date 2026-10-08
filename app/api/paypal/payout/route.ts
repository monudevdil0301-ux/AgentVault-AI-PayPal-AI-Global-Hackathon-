import { NextRequest, NextResponse } from 'next/server';
import { executePayPalPayout } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { receiverEmail, amount, note, milestoneId, clientId, clientSecret } = body;

    if (!receiverEmail || !amount) {
      return NextResponse.json({ error: 'receiverEmail and amount are required' }, { status: 400 });
    }

    const result = await executePayPalPayout(
      {
        receiverEmail,
        amount: parseFloat(amount),
        note: note || 'AgentVault Escrow Release',
        milestoneId,
      },
      clientId,
      clientSecret
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'PayPal Payout request failed' },
      { status: 500 }
    );
  }
}
