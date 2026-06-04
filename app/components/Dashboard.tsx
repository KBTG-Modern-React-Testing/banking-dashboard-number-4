'use client';

import { useEffect, useState } from 'react';
import { Balance, Transaction } from '@/app/types';
import AccountBalance from './AccountBalance';
import TransactionList from './TransactionList';
import TransferForm from './TransferForm';
import ThemeToggle from './ThemeToggle';

export default function Dashboard() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [balanceRes, transRes] = await Promise.all([
          fetch('/api/balance'),
          fetch('/api/transactions'),
        ]);
        const balanceData: Balance = await balanceRes.json();
        const transData = await transRes.json();
        setBalance(balanceData);
        setTransactions(transData.transactions ?? []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleTransactionAdded(transaction: Transaction) {
    setTransactions((prev) => [transaction, ...prev]);
    // Deduct balance
    setBalance((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        amount: Math.max(0, prev.amount - transaction.amount),
      };
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BankIcon />
            <div>
              <h1 className="text-base font-bold leading-none text-slate-900 dark:text-white sm:text-lg">
                Modern Banking
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* Balance card */}
        <AccountBalance balance={balance} loading={loading} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Transfer form — 1/3 width on desktop */}
          <div className="lg:col-span-1">
            <TransferForm onTransactionAdded={handleTransactionAdded} />
          </div>

          {/* Transaction list — 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}

function BankIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="1" />
        <path d="M3 11L12 2l9 9" />
        <line x1="9" y1="22" x2="9" y2="11" />
        <line x1="15" y1="22" x2="15" y2="11" />
      </svg>
    </div>
  );
}
