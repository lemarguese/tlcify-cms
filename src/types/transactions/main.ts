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
