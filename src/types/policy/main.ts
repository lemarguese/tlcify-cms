import type { IInsurance } from "@/types/insurance/main.ts";

export interface IPolicy {
  insurance: IInsurance;
  policyNumber: string;
  type: string;
  status: string;
  effectiveDate: string;
  expirationDate: string;
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

export interface IPolicyFee {
  type: 'late' | 'cancellation' | 'return' | 'reinstatement';
  dueDate: string;
  amount: number;
}

export interface IPolicyFeeCreate extends IPolicyFee {}
