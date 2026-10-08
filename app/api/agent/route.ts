import { NextRequest, NextResponse } from 'next/server';
import { processAgentPrompt } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, apiKey, context } = body;

    const result = await processAgentPrompt(prompt, apiKey, context);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Agent processing error' },
      { status: 500 }
    );
  }
}
