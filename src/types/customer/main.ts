export interface ICustomer {
  _id: string;
  firstName: string | null,
  lastName: string | null,
  corporationName: string | null,
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

export interface CustomerVehicleLicenseInfo {
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
