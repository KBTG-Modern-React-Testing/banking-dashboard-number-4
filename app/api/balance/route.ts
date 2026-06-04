import { NextResponse } from 'next/server';
import { getBalance } from '@/app/lib/store';

export async function GET() {
  return NextResponse.json({
    amount: getBalance(),
    currency: 'USD',
  });
}
