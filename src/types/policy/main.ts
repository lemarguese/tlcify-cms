import type { IInsurance } from "@/types/insurance/main.ts";
import type { ICustomer } from "@/types/customer/main.ts";

export interface IPolicy {
  _id: string;
  customer: ICustomer;
  insurance: IInsurance;
  policyNumber: string;
  type: string;
  status: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  customEffectiveDate?: Date;
  policyTerm: string;
  premiumPrice: number;
  installmentCount: number;
  fees: IPolicyFee[];
  cycles: IPolicyCycle[];
  matchedFees: {
    fees: IPolicyFee[];
    total: number;
  }
  monthlyPayment: number;
  deposit: number;
}

export interface IPolicyCreate extends Omit<IPolicy, 'insurance' | 'customer' | 'matchedFees'> {
  insuranceId: string;
}

export interface IUpdatePolicy extends Omit<IPolicy, 'insurance' | 'customer' | 'matchedFees'> {
  insuranceId: string;
}

export interface IPolicyByCustomer extends IPolicy {
  dueDate: Date;
  amountDue: number;
}

export interface IPolicyFee {
  _id: string;
  type: 'late' | 'cancellation' | 'return' | 'reinstatement';
  dueDate: Date | undefined;
  amount: number;
}

export interface IPolicyCycle {
  cycle: number,
  dueDate: Date,
  baseAmount: number,
  fees: IPolicyFee[],
  totalPaid: number,
  carryOver: number,
  totalDue: number,
  amountRemaining: number
}

export interface IPolicyFeeCreate extends Omit<IPolicyFee, '_id'> {
}
