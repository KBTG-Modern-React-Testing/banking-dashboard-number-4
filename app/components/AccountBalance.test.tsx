import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountBalance from './AccountBalance';
import type { Balance } from '@/app/types';

describe('AccountBalance', () => {
  it('renders loading state', () => {
    render(<AccountBalance balance={null} loading={true} />);

    expect(screen.getByLabelText('Account Balance')).toBeInTheDocument();
    expect(screen.getByText('Available Balance')).toBeInTheDocument();
    expect(screen.queryByText('Unable to load balance')).not.toBeInTheDocument();
  });

  it('renders balance when data exists', () => {
    const mockBalance: Balance = {
      amount: 1500,
      currency: 'USD',
    };

    render(<AccountBalance balance={mockBalance} loading={false} />);

    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('USD · Current Account')).toBeInTheDocument();
  });

  it('renders error message when balance is null and not loading', () => {
    render(<AccountBalance balance={null} loading={false} />);

    expect(screen.getByText('Unable to load balance')).toBeInTheDocument();
  });
});