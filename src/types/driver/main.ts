import type { ICustomer } from "@/types/customer/main.ts";

export interface IDriver {
  customer: ICustomer,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  dateOfBirth: string,
  address: string,
  tlcNumber: string,
  tlcExp: string,
  driverLicenseNumber: string,
  driverLicenseExp: string,
  lastSSN: string,
  defensiveDriverCourseExp: string,
}

export interface IDriverCreate extends Omit<IDriver, 'customer'> {
  customerId: string;
}
