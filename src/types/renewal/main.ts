import type { ICustomer } from "@/types/customer/main.ts";

export interface IRenewal extends Pick<ICustomer, 'firstName' | 'lastName' | 'tlcFhvNumber' | 'dmvExpiration' | 'tlcFhvExpiration' | 'defensiveDriverCourseExpiration' | '_id'> {
}

export interface IRenewalFilter {
  tlcFhvExpirationFrom?: Date;
  tlcFhvExpirationTo?: Date;
  dmvExpirationFrom?: Date;
  dmvExpirationTo?: Date;
  ddcExpFrom?: Date;
  ddcExpTo?: Date;
}
