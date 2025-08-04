export interface IInsurance {
  _id: string;
  name: string;
  naicCode: string;
  commissionFee: number;
  brokerCode: string;
}

export interface IInsuranceCreate extends Omit<IInsurance, '_id'> {
}
