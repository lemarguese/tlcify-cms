import type { ICustomer } from "@/types/customer/main.ts";
import type { IPolicy } from "@/types/policy/main.ts";

export interface IInvoicePolicy {
  policy: IPolicy;
  number: string;
  insuranceCarrierName: string;
  dueDate: Date;
  amount: number;
  totalDueDateFee: number;
}

export interface IInvoicePolicyCreate extends Omit<IInvoicePolicy, 'policy'> {
  policy: string;
}

export interface IInvoice {
  _id: string; // -
  customer: ICustomer;
  policies: IInvoicePolicy[];
  invoiceNumber: string; // -
  currency: string; // -
  status: "pending" | "paid" | "overdue" | "canceled"; // -
  issuedAt: Date;
  emailSent?: boolean;
  paidAt?: Date; // -
  notes?: string;
}

export interface IInvoiceCreate extends Omit<IInvoice, 'customer' | 'policies' | '_id' | 'status' | 'paidAt' | 'invoiceNumber' | 'currency' | 'emailSent'> {
  customer: string;
  policies: IInvoicePolicyCreate[]
}
