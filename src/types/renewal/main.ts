import type { ICustomer } from "@/types/customer/main.ts";

export interface IRenewal extends Pick<ICustomer, 'firstName' | 'lastName' | 'tlcFhvNumber' | 'tlcFhvExpiration' | 'defensiveDriverCourseExpiration' | '_id'> {
}

export interface IRenewalFilter extends Partial<Pick<IRenewal, 'tlcFhvExpiration' | 'defensiveDriverCourseExpiration'>> {

}
