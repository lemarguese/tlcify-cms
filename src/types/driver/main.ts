export interface IDriver {
  customerId: string,
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

export interface IDriverCreate extends IDriver {}
