export interface ICustomer {
  _id: string;
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

export interface ICustomerCreate extends Omit<ICustomer, '_id'> {}
export interface ICustomerUpdate extends Omit<ICustomer, '_id'> {}
