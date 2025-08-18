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
  method: 'card' | 'check' | 'zelle' | 'cash' | 'other';
  paidAt?: Date | string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentCreate extends Pick<IPayment, 'method' | 'paidAt' | 'notes' | 'discountAmount' | 'totalPaid'> {
  paidAt?: string | Date
}
