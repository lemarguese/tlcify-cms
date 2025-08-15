export interface IPayment {
  _id: string;
  policyId: string
  cycle: number;
  dueDate: Date;
  currency: string;
  baseAmount: number;
  discountAmount: number;
  totalPaid: number;
  provider: string;
  providerRef: string;
  method: "card" | "cash" | "check";
  paidAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// export interface IPaymentSubmit<T> {
//   policyId: string,
//   provider: string,
//   providerRef: string,
//   method: 'card' | 'check' | 'other',
//   totalPaid: number,
//   currency?: 'USD',
//   discountAmount?: number,
//   paidAt: string,
//   notes?: string
// }
