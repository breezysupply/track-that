import { Transaction } from './Transaction';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  balance: number;
  transactions: Transaction[];
}
