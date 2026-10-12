// PayPal Sandbox REST API Direct Client
// Hits https://api-m.sandbox.paypal.com directly

export interface PayPalOrderRequest {
  amount: number;
  currency?: string;
  description: string;
  merchantName?: string;
  agentId?: string;
}

export interface PayPalPayoutRequest {
  receiverEmail: string;
  amount: number;
  currency?: string;
  note: string;
  milestoneId?: string;
}

// 1. Get Live OAuth Access Token from PayPal Sandbox
export async function getPayPalAccessToken(clientId?: string, clientSecret?: string): Promise<string> {
  // Priority: 1. Server Environment Variables (Vercel / .env.local)
  //           2. Client-provided credentials if they are valid
  const serverCid = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const serverSecret = process.env.PAYPAL_CLIENT_SECRET;

  const isClientDummy = (val?: string) => !val || val.includes('_VERIFIED') || val.includes('_ACTIVE_KEY') || val.includes('your_paypal');

  const cid = (!isClientDummy(clientId) ? clientId : null) || serverCid;
  const secret = (!isClientDummy(clientSecret) ? clientSecret : null) || serverSecret;

  if (!cid || !secret) {
    throw new Error('PayPal Sandbox Client ID or Secret is missing. Please configure credentials in Settings or Vercel Environment Variables.');
  }

  const auth = Buffer.from(`${cid}:${secret}`).toString('base64');
  const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`PayPal OAuth authentication failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.access_token;
}

// 2. Create PayPal Sandbox Order (Orders API v2)
export async function createPayPalOrder(order: PayPalOrderRequest, clientId?: string, clientSecret?: string) {
  const token = await getPayPalAccessToken(clientId, clientSecret);
  const currency = order.currency || 'USD';

  const res = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `agent-procure-${Date.now()}`,
          description: order.description,
          amount: {
            currency_code: currency,
            value: order.amount.toFixed(2),
          },
        },
      ],
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`PayPal Order creation failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    status: data.status,
    createTime: data.create_time,
    links: data.links,
    raw: data,
  };
}

// 3. Execute PayPal Sandbox Payout (Payouts API v1)
export async function executePayPalPayout(payout: PayPalPayoutRequest, clientId?: string, clientSecret?: string) {
  const token = await getPayPalAccessToken(clientId, clientSecret);
  const currency = payout.currency || 'USD';
  const batchId = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const res = await fetch('https://api-m.sandbox.paypal.com/v1/payments/payouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: batchId,
        email_subject: `AgentVault Escrow Payout: ${payout.note}`,
        recipient_type: 'EMAIL',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: payout.amount.toFixed(2),
            currency: currency,
          },
          note: payout.note,
          receiver: payout.receiverEmail,
          sender_item_id: payout.milestoneId || `ITEM-${Date.now()}`,
        },
      ],
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`PayPal Payout failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    batchId: data.batch_header?.payout_batch_id || batchId,
    status: data.batch_header?.batch_status || 'PENDING',
    raw: data,
  };
}

// 4. Suspend/Cancel PayPal Billing Agreement (Subscriptions API)
export async function cancelPayPalSubscription(agreementId: string, reason: string, clientId?: string, clientSecret?: string) {
  const token = await getPayPalAccessToken(clientId, clientSecret);

  const res = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${agreementId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: reason || 'AgentVault automated subscription waste reclamation',
    }),
    cache: 'no-store',
  });

  if (!res.ok && res.status !== 204) {
    const errorText = await res.text();
    throw new Error(`PayPal Subscription cancellation failed (${res.status}): ${errorText}`);
  }

  return {
    agreementId,
    status: 'CANCELLED',
    timestamp: new Date().toISOString(),
  };
}
