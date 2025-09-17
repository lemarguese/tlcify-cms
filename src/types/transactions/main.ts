import type { IPolicy } from "@/types/policy/main.ts";

export interface IPayment {
  _id: string;
  policy: IPolicy;
  cycle: number;
  dueDate: Date;
  currency: string;
  baseAmount: number;
  discountAmount: number;
  totalPaid: number;
  provider: string;
  providerRef: string;
  method: 'card' | 'check' | 'zelle' | 'cash' | 'other';
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean,
  deletedAt: boolean
}

export interface IPaymentCreate extends Pick<IPayment, 'method' | 'paidAt' | 'notes' | 'discountAmount' | 'totalPaid'> {
  policyId: string;
  paidAt?: Date
}

export interface IPaymentQuery {
  insuranceCarrier?: string;
  fromDate?: Date;
  toDate?: Date;
  paymentMethod?: string;
}
