'use client';

import { useState } from 'react';
import { Transaction, TransactionStatus } from '@/app/types';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}

const STATUS_FILTERS: TransactionStatus[] = ['All', 'Pending', 'Completed', 'Failed'];

const STATUS_STYLES: Record<string, string> = {
  Pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  Completed:
    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Failed:
    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export default function TransactionList({ transactions, loading }: TransactionListProps) {
  const [activeFilter, setActiveFilter] = useState<TransactionStatus>('All');

  const filtered =
    activeFilter === 'All'
      ? transactions
      : transactions.filter((t) => t.status === activeFilter);

  return (
    <section aria-label="Transaction History" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Transaction History
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'transaction' : 'transactions'}
        </span>
      </div>

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter transactions by status"
        className="flex flex-wrap gap-2"
      >
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            role="tab"
            aria-selected={activeFilter === status}
            onClick={() => setActiveFilter(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeFilter === status
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Transaction items */}
      <div className="flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700/50"
            />
          ))
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-600">
            <p className="text-sm text-slate-500 dark:text-slate-400">No transactions found</p>
          </div>
        ) : (
          filtered.map((txn) => (
            <article
              key={txn.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                  <TransactionIcon status={txn.status} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {txn.description}
                  </p>
                  {txn.recipient && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      To: {txn.recipient}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(txn.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {formatCurrency(txn.amount)}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[txn.status]}`}
                >
                  {txn.status}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function TransactionIcon({ status }: { status: Transaction['status'] }) {
  if (status === 'Completed') {
    return (
      <svg
        className="h-5 w-5 text-green-600 dark:text-green-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (status === 'Failed') {
    return (
      <svg
        className="h-5 w-5 text-red-500 dark:text-red-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg
      className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
