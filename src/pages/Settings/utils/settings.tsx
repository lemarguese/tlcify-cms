import type { ColumnsType } from "antd/es/table";
import type { IRole, ISettings, ISettingsCreate } from "@/types/settings/main.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { instance } from "@/api/axios.ts";
import type { IUser } from "@/types/user/main.ts";
import { useNavigate } from "react-router";
import type { RadioChangeEvent } from "antd";
import type { RcFile } from "antd/es/upload";

export const settingsRolesTableHeaders: ColumnsType<IRole> = [
  {
    title: "Role",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <strong>{text}</strong>,
  },
  {
    title: "Permissions",
    dataIndex: "permissions",
    key: "permissions",
    render: (perms: string[]) =>
      perms && perms.length > 0 ? perms.join(", ") : "—",
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div>
        <a onClick={() => console.log("Edit", record)}>Edit</a>
        {" | "}
        <a onClick={() => console.log("Delete", record)}>Delete</a>
      </div>
    ),
  },
];

const settingsInitialStateTemplate: Omit<ISettings, 'company'> = {
  roles: [],

  // Fees & payments
  lateFeeAmount: 0,
  lateFeeGraceDays: 0,
  autopayEnabledByDefault: true,

  // Notifications
  sendSms: true,
  sendEmail: true,

  // UI / Customization
  theme: 'light',
  currency: 'usd',
  // timezone: string;
  language: 'en',

  createdAt: new Date(),
  updatedAt: new Date()
}

export const settingsInitialState: ISettings = {
  ...settingsInitialStateTemplate,
  company: {
    logoUrl: '',
    name: '',
    description: ''
  },
}

export const userInitialState: IUser = {
  email: '',
  privilege: 'manager',
  avatarUrl: ''
}

export const newSettingsFormInitialState: ISettingsCreate = {
  ...settingsInitialStateTemplate,
  companyName: '',
  companyDescription: ''
}

export const getSettingsFunctions = () => {
  const navigate = useNavigate();

  const [settingsForm, setSettingsForm] = useState<ISettingsCreate>(newSettingsFormInitialState);
  const [settings, setSettings] = useState<ISettings>(settingsInitialState);

  useEffect(() => {
    const { company, ...data } = settings;
    setSettingsForm({
      ...data,
      companyName: company.name,
      companyDescription: company.description
    })
  }, [settings]);

  const fetchSettings = async () => {
    const response = await instance.get('/settings');
    setSettings(response.data);
    setSettingsForm(response.data);
  }

  const changeSettingsFile = useCallback((val: RcFile) => {
    setSettingsForm(prev => ({
      ...prev,
      companyPhoto: val
    }))
  }, [])

  const changeSettingsInput = useCallback((key: keyof ISettingsCreate) => {
    return (val: string | RadioChangeEvent) => {
      setSettingsForm(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value
      }))
    }
  }, []);

  const changeSettingsSwitch = useCallback((key: keyof Pick<ISettingsCreate, 'autopayEnabledByDefault' | 'sendSms' | 'sendEmail'>) => {
    return (val: boolean) => {
      setSettingsForm(prev => ({
        ...prev,
        [key]: val
      }))
    }
  }, []);

  const touchedSettingsFields = useMemo(() => {
    let touchedFields: Partial<ISettings> = {};

    for (const [k] of Object.entries(settings)) {
      if (k === "company") {
        touchedFields = { ...touchedFields, ...companyChanges(settings, settingsForm) };
      } else if (k === "roles") {
        touchedFields = { ...touchedFields, ...rolesChanges(settings, settingsForm) };
      } else {
        const oldVal = settings[k as keyof typeof settings];
        const newVal = settingsForm[k as keyof typeof settingsForm];
        if (oldVal !== newVal) {
          touchedFields[k as keyof ISettingsCreate] = newVal as any;
        }
      }
    }

    if (settingsForm.companyPhoto) touchedFields.company = { ...touchedFields.company, logoUrl: 'touched' }

    return touchedFields;
  }, [settings, settingsForm]);

  const updateSettings = useCallback(async () => {
    let patchData = { ...touchedSettingsFields };

    if (settingsForm.companyPhoto) {
      const formData = new FormData();
      formData.set("files", settingsForm.companyPhoto);
      formData.set("type", "companyName");
      formData.set("metaDescription", "company-name-logo-url");

      const response = await instance.post("/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const companyUrl = response.data ? response.data[0].url : response.data;

      patchData = {
        ...patchData,
        company: {
          ...settings.company,
          ...touchedSettingsFields.company,
          logoUrl: companyUrl,
        },
      };
    }

    await instance.patch("/settings", patchData);
    await fetchSettings();
  }, [settingsForm, touchedSettingsFields]);

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [])

  return {
    fetchSettings, settings, navigateBack,

    changeSettingsInput, changeSettingsFile, changeSettingsSwitch,

    settingsForm,

    updateSettings,
    fieldsTouched: Object.keys(touchedSettingsFields).length !== 0
  }
}

function companyChanges (settings: ISettings, form: ISettingsCreate) {
  const touched: Partial<ISettings> = {};
  if (settings.company.name !== form.companyName) {
    touched.company = {
      description: settings.company.description,
      logoUrl: settings.company.logoUrl,
      ...touched.company,
      name: form.companyName
    };
  }
  if (settings.company.description !== form.companyDescription) {
    touched.company = {
      logoUrl: settings.company.logoUrl,
      name: settings.company.name,
      ...touched.company,
      description: form.companyDescription,
    };
  }
  return touched;
}

function rolesAreEqual (a: IRole[], b: IRole[]): boolean {
  if (a.length !== b.length) return false;

  return a.every((role, i) => {
    const other = b[i];
    if (!other) return false;
    if (role.name !== other.name) return false;

    const permsA = [...role.permissions].sort();
    const permsB = [...other.permissions].sort();

    return permsA.length === permsB.length && permsA.every((p, idx) => p === permsB[idx]);
  });
}

function rolesChanges (settings: ISettings, form: ISettingsCreate) {
  return rolesAreEqual(settings.roles, form.roles) ? {} : { roles: form.roles };
}


