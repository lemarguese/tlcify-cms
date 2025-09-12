import type { ICustomer } from "@/types/customer/main.ts";

export interface IDriver {
  _id: string;
  customer: ICustomer,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  dateOfBirth: Date,
  address: string,
  apartmentNumber: string
  tlcNumber: string,
  tlcExp: Date,
  driverLicenseNumber: string,
  driverLicenseExp: Date,
  lastSSN: string,
  defensiveDriverCourseExp: Date,
}

export interface IDriverCreate extends Omit<IDriver, 'customer' | '_id'> {
  customer: string;
}

export interface IDriverUpdate extends Omit<IDriver, 'customer' | '_id'> {
  customer: string;
}

export interface DriverVehicleLicenseInfo {
  license_number: string,
  wheelchair_accessible_trained: string,
  last_date_updated: string,
  last_time_updated: string,
  expiration_date: string
  name: string,
  type: string
}
