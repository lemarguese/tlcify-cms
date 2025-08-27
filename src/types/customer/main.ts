export interface ICustomer {
  _id: string;
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  dateOfBirth: Date,
  address: string,
  apartmentNumber?: string,
  tlcFhvNumber: string,
  tlcFhvExpiration: Date,
  dmvPlaceNumber: string,
  dmvExpiration: Date,
  vehicleVIN: string,
  driverLicenseNumber: string,
  driverLicenseExpiration: Date,
  lastSSN?: string,
  defensiveDriverCourseExpiration?: Date,
  isSmsSubscribed?: boolean,
  isAutoPayEnabled?: boolean
}

export interface ICustomerCreate extends Omit<ICustomer, '_id'> {
}

export interface ICustomerUpdate extends Omit<ICustomer, '_id'> {
}
