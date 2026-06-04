'use client';

import { useState, FormEvent } from 'react';
import { Transaction } from '@/app/types';

interface TransferFormProps {
  onTransactionAdded: (transaction: Transaction) => void;
}

interface FormErrors {
  amount?: string;
  recipient?: string;
}

export default function TransferForm({ onTransactionAdded }: TransferFormProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  function validate(): FormErrors {
    const errs: FormErrors = {};
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      errs.amount = 'Please enter a valid amount greater than zero.';
    }
    if (!recipient.trim()) {
      errs.recipient = 'Recipient name is required.';
    }
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccessMessage('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          recipient: recipient.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ amount: data.error ?? 'Transfer failed. Please try again.' });
        return;
      }

      const newTransaction: Transaction = await res.json();
      onTransactionAdded(newTransaction);
      setAmount('');
      setRecipient('');
      setDescription('');
      setSuccessMessage('Transfer completed successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch {
      setErrors({ amount: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Transfer Funds" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Send Money
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex flex-col gap-5">
          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Amount (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                $
              </span>
              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
                aria-invalid={!!errors.amount}
                className={`w-full rounded-lg border py-2.5 pl-8 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 ${
                  errors.amount
                    ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
                    : 'border-slate-200 dark:border-slate-600'
                }`}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" role="alert" className="text-xs text-red-500">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Recipient */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="recipient"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Recipient <span className="text-red-500">*</span>
            </label>
            <input
              id="recipient"
              type="text"
              placeholder="e.g. John Doe"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (errors.recipient)
                  setErrors((prev) => ({ ...prev, recipient: undefined }));
              }}
              aria-describedby={errors.recipient ? 'recipient-error' : undefined}
              aria-invalid={!!errors.recipient}
              className={`w-full rounded-lg border py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 ${
                errors.recipient
                  ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
                  : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.recipient && (
              <p id="recipient-error" role="alert" className="text-xs text-red-500">
                {errors.recipient}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description{' '}
              <span className="font-normal text-slate-400 dark:text-slate-500">(optional)</span>
            </label>
            <input
              id="description"
              type="text"
              placeholder="e.g. Dinner payment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Success message */}
          {successMessage && (
            <p role="status" className="rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {successMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {submitting ? (
              <>
                <Spinner />
                Processing…
              </>
            ) : (
              'Transfer'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        className="opacity-25"
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
      />
    </svg>
  );
}
