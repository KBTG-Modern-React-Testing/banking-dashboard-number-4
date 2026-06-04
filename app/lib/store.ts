import { Transaction } from '../types';

let nextId = 5;
let accountBalance = 15000.5;

const transactions: Transaction[] = [
  {
    id: 'txn_1',
    amount: 1500.0,
    currency: 'USD',
    status: 'Completed',
    description: 'Payment to vendor',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'txn_2',
    amount: 250.0,
    currency: 'USD',
    status: 'Pending',
    description: 'Transfer to savings',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'txn_3',
    amount: 75.5,
    currency: 'USD',
    status: 'Completed',
    description: 'Online purchase',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'txn_4',
    amount: 500.0,
    currency: 'USD',
    status: 'Failed',
    description: 'Failed payment',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function getTransactions(): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addTransaction(
  data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Transaction {
  const now = new Date().toISOString();
  const newTransaction: Transaction = {
    ...data,
    id: `txn_${nextId++}`,
    createdAt: now,
    updatedAt: now,
  };
  transactions.unshift(newTransaction);
  return newTransaction;
}

export function getBalance(): number {
  return accountBalance;
}

export function deductBalance(amount: number): boolean {
  if (amount <= 0 || amount > accountBalance) {
    return false;
  }
  accountBalance -= amount;
  return true;
}
