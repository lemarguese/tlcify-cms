export interface ICustomer {
  _id: string;
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  dateOfBirth: Date,
  address: string,
  tlcNumber: string,
  tlcExp: Date,
  driverLicenseNumber: string,
  driverLicenseExp: Date,
  lastSSN: string,
  defensiveDriverCourseExp: Date,
}

export interface ICustomerCreate extends Omit<ICustomer, '_id'> {}
export interface ICustomerUpdate extends Omit<ICustomer, '_id'> {}
