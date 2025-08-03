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
  additionalFees: IPolicyFee[];
  monthlyPayment: number;
  deposit: number;
}

export interface IPolicyCreate extends Omit<IPolicy, 'insurance' | 'additionalFees'>{
  insuranceId: string;
}

export interface IPolicyFee {
  policyId: string;
  type: 'late' | 'cancellation' | 'return' | 'reinstatement';
  amount: number;
}
