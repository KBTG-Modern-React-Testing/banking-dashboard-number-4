'use client';

import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Transaction } from '@/app/types';

interface TransferFormProps {
  onTransactionAdded: (transaction: Transaction) => void;
}

const transferFormSchema = z.object({
  amount: z
    .number({ error: 'Please enter a valid amount greater than zero.' })
    .positive('Please enter a valid amount greater than zero.'),
  recipient: z
    .string()
    .trim()
    .min(1, 'Recipient name is required.'),
  description: z.string(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

export default function TransferForm({ onTransactionAdded }: TransferFormProps) {
  const [successMessage, setSuccessMessage] = useState('');
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      amount: undefined,
      recipient: '',
      description: '',
    },
  });

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  async function onSubmit(values: TransferFormValues) {
    setSuccessMessage('');
    clearErrors('root.server');

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: values.amount,
          recipient: values.recipient.trim(),
          description: values.description.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError('root.server', {
          type: 'server',
          message: data?.error ?? 'Transfer failed. Please try again.',
        });
        return;
      }

      const newTransaction: Transaction = await res.json();
      onTransactionAdded(newTransaction);
      reset();
      setSuccessMessage('Transfer completed successfully!');

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => setSuccessMessage(''), 4000);
    } catch {
      setError('root.server', {
        type: 'network',
        message: 'Network error. Please try again.',
      });
    }
  }

  return (
    <section aria-label="Transfer Funds" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Send Money
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
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
                {...register('amount', {
                  valueAsNumber: true,
                })}
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
                {errors.amount.message}
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
              {...register('recipient')}
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
                {errors.recipient.message}
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
              {...register('description')}
              className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Error message */}
          {errors.root?.server?.message && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
            >
              {errors.root.server.message}
            </p>
          )}

          {/* Success message */}
          {successMessage && (
            <p role="status" className="rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {successMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isSubmitting ? (
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
