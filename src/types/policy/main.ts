import type { IInsurance } from "@/types/insurance/main.ts";

export interface IPolicy {
  _id: string;
  insurance: IInsurance;
  policyNumber: string;
  type: string;
  status: string;
  effectiveDate: string | undefined;
  expirationDate: string | undefined;
  policyTerm: string;
  premiumPrice: number;
  installmentCount: string;
  fees: IPolicyFee[];
  monthlyPayment: number;
  deposit: number;
}

export interface IPolicyCreate extends Omit<IPolicy, 'insurance'>{
  insuranceId: string;
}

export interface IUpdatePolicy extends Omit<IPolicy, 'insurance'>{
  insuranceId: string;
}

export interface IPolicyFee {
  type: 'late' | 'cancellation' | 'return' | 'reinstatement';
  dueDate: string | undefined;
  amount: number;
}

export interface IPolicyFeeCreate extends IPolicyFee {}
