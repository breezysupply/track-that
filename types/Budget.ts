export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  balance: number;
  transactions: Transaction[];
}
