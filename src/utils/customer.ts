import type { ICustomer } from "@/types/customer/main.ts";

export const formatCustomerName = (customer: Pick<ICustomer, 'firstName' | 'lastName' | 'corporationName'>) => {
  if (customer.corporationName) {
    return customer.corporationName;
  }
  if (customer.firstName || customer.lastName) {
    return [customer.firstName, customer.lastName].filter(Boolean).join(" ");
  }
  return "(Unnamed Customer)";
}
