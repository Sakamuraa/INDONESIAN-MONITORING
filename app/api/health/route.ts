import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    system: 'OnheilAlert API Gateway',
    timestamp: new Date().toISOString(),
    services: {
      bmkg: 'operational',
      inarisk: 'operational',
      bnpb: 'operational',
    },
    version: '1.0.0',
    noAI: true,
  });
}
