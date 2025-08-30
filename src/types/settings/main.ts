/** Role & Permission type */
export interface IRole {
  name: string;                  // e.g. "admin", "broker", "customer"
  permissions: string[];         // e.g. ["create_policy", "apply_fees"]
}

export interface ICompany {
  logoUrl: string,
  name: string,
  description: string
}

/** Settings document type */
export interface ISettings {
  roles: IRole[];
  company: ICompany;

  // Fees & payments
  lateFeeAmount: number;         // flat fee or % (you decide in logic)
  lateFeeGraceDays: number;      // days after dueDate before fee applies
  // overpaymentBehavior: "carry" | "credit";
  autopayEnabledByDefault: boolean;

  // Notifications
  sendSms: boolean;
  sendEmail: boolean;

  // UI / Customization
  theme: "light" | "dark";
  currency: string;
  language: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface ISettingsCreate extends Omit<ISettings, 'company'> {
  companyName: string;
  companyDescription: string;
  companyPhoto?: FileType
}
