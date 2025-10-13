export interface ICreditCardDetails {
  cardHolderName: string;
  number: string;
  monthExpiration: string;
  yearExpiration: string;
  verificationCode: string;
}

export interface IAchDetails {
  accountNumber: string;
  accountType: AccountType;
  checkHolderName: string;
  checkType: CheckType;
  routingNumber: string;
  customerBillingAddress: IAchCustomerAddress
}

export interface IAchCustomerAddress {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
}

export enum AccountType {
  Checking = "CHECKING",
  Savings = "SAVINGS",
  Credit = "Credit"
}

export enum CheckType {
  Personal = "PERSONAL",
  Business = "BUSINESS",
  Payroll = "PAYROLL"
}
