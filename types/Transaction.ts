export interface Transaction {
  id: string;  // Ensure this is string, not number
  amount: number;
  description: string;
  date?: string;  // Make date optional by adding '?'
}
