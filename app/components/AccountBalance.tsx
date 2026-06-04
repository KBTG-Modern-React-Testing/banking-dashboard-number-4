'use client';

import { Balance } from '@/app/types';

interface AccountBalanceProps {
  balance: Balance | null;
  loading: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function AccountBalance({ balance, loading }: AccountBalanceProps) {
  return (
    <section
      aria-label="Account Balance"
      className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg dark:from-blue-700 dark:to-blue-900 sm:p-8"
    >
      <p className="text-sm font-medium uppercase tracking-widest text-blue-100">
        Available Balance
      </p>

      {loading ? (
        <div className="mt-3 h-12 w-48 animate-pulse rounded-lg bg-blue-500 opacity-50" />
      ) : balance ? (
        <>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            {formatCurrency(balance.amount)}
          </p>
          <p className="mt-1 text-sm text-blue-200">{balance.currency} · Current Account</p>
        </>
      ) : (
        <p className="mt-3 text-red-200">Unable to load balance</p>
      )}
    </section>
  );
}
