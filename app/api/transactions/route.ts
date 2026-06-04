import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, addTransaction, deductBalance } from '@/app/lib/store';

export async function GET() {
  const transactions = getTransactions();
  return NextResponse.json({
    transactions,
    pagination: {
      currentPage: 1,
      itemsPerPage: transactions.length,
      totalItems: transactions.length,
      totalPages: 1,
    },
  });
}

export async function POST(request: NextRequest) {
  let body: { amount?: unknown; recipient?: unknown; description?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const amount = Number(body.amount);
  const recipient = typeof body.recipient === 'string' ? body.recipient.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';

  if (!amount || isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { error: 'Amount must be a positive number greater than zero' },
      { status: 400 }
    );
  }

  if (!recipient) {
    return NextResponse.json(
      { error: 'Recipient is required' },
      { status: 400 }
    );
  }

  // Attempt to deduct balance
  const deducted = deductBalance(amount);
  if (!deducted) {
    return NextResponse.json(
      { error: 'Insufficient balance' },
      { status: 400 }
    );
  }

  // Create transaction with Completed status
  const transaction = addTransaction({
    amount,
    currency: 'USD',
    status: 'Completed',
    description: description || `Transfer to ${recipient}`,
    recipient,
  });

  return NextResponse.json(transaction, { status: 201 });
}
