import type { ICustomer } from "@/types/customer/main.ts";

export interface IRenewal extends Pick<ICustomer, 'firstName' | 'lastName' | 'tlcNumber' | 'tlcExp' | 'defensiveDriverCourseExp' | '_id'> {
}
