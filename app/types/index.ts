export interface Transaction {
  id: string;
  amount: number;
  currency: 'USD';
  status: 'Pending' | 'Completed' | 'Failed';
  description: string;
  recipient?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 'All' | 'Pending' | 'Completed' | 'Failed';

export interface Balance {
  amount: number;
  currency: 'USD';
}

export interface TransferRequest {
  amount: number;
  recipient: string;
  description?: string;
}

export interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: PaginationInfo;
}
