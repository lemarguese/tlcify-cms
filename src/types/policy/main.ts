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
  installmentCount: string;
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
  fees: number,
  totalPaid: number,
  carryOver: number,
  totalDue: number,
  amountRemaining: number
}

export interface IPolicyFeeCreate extends Omit<IPolicyFee, '_id'> {
}

export interface VehicleLicenseInfo {
  active: string;
  vehicle_license_number: string;
  name: string;
  license_type: string;
  expiration_date: string;
  permit_license_number: string;
  dmv_license_plate_number: string;
  vehicle_vin_number: string;
  certification_date: string;
  hack_up_date: string;
  vehicle_year: string;
  base_number: string;
  base_name: string;
  base_type: string;
  veh: string;
  base_telephone_number: string;
  base_address: string;
  reason: string;
  last_date_updated: string;
  last_time_updated: string;
}
