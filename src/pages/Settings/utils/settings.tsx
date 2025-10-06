import type { ColumnsType } from "antd/es/table";
import type { IRole, ISettings, ISettingsCreate } from "@/types/settings/main.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react'
import { instance } from "@/api/axios.ts";
import type { IUser } from "@/types/user/main.ts";
import { useNavigate } from "react-router";
import type { CheckboxChangeEvent, RadioChangeEvent } from "antd";
import type { RcFile } from "antd/es/upload";
import { Button } from "antd";
import type { TableRowSelection } from "antd/es/table/interface";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";

export const settingsRolesTableHeaders: ColumnsType = [
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
    render: (perms: string[]) => <div className='settings_page_roles_chips'>
      {perms.map(p => <div className='settings_page_roles_chips_item'>
        {permissionsTypeTexts[p]}
      </div>)}
    </div>
  },
];

export const getSettingsFunctions = () => {
  const navigate = useNavigate();
  const { success, error } = useNotify();

  const [settingsForm, setSettingsForm] = useState<ISettingsCreate>(newSettingsFormInitialState);
  const [settings, setSettings] = useState<ISettings>(settingsInitialState);

  const [isUpdateRolesModalOpen, setIsUpdateRolesModalOpen] = useState(false);
  const [isCreateRolesModalOpen, setIsCreateRolesModalOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<IRole>();

  const [rolesSelection] = useState<TableRowSelection>({
    onSelect: (_, _s, multipleRows) => {
      const isMultipleSelected = multipleRows.length > 1;
      const [selectedRole] = multipleRows as IRole[];

      setSelectedRole(!isMultipleSelected ? selectedRole : undefined);
    },
  });

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
    return (val: BaseSyntheticEvent | RadioChangeEvent) => {
      setSettingsForm(prev => ({
        ...prev,
        [key]: val.target.value
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
      } else {
        const oldVal = settings[k as keyof typeof settings];
        const newVal = settingsForm[k as keyof typeof settingsForm];
        if (oldVal !== newVal) {
          touchedFields[k as keyof ISettings] = newVal as any;
        }
      }
    }

    // @ts-ignore
    if (settingsForm.companyPhoto) touchedFields.company = { ...touchedFields.company, logoUrl: 'touched' }

    return touchedFields;
  }, [settings, settingsForm]);

  const updateSettings = useCallback(async () => {
    try {
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
      success('Settings successfully updated!');
      await fetchSettings();
    } catch (e: any) {
      error(e.message);
    }
  }, [settingsForm, touchedSettingsFields]);

  const openUpdateRolesModal = () => {
    setIsUpdateRolesModalOpen(true)
  }

  const cancelUpdateRolesModal = useCallback(() => {
    setIsUpdateRolesModalOpen(false);
  }, []);

  const cancelCreateRolesModal = useCallback(() => {
    setIsCreateRolesModalOpen(false);
  }, [])

  const openCreateRolesModal = () => {
    setIsCreateRolesModalOpen(true)
  }

  const updateRoles = useCallback(async (roles: IRole[]) => {
    try {
      await instance.patch('/settings', { roles });
      success('Roles successfully updated!');
      await cancelUpdateRolesModal();
      await fetchSettings();
    } catch (e: any) {
      error(e.message);
    }
  }, []);

  const addRole = useCallback(async (role: IRole) => {
    try {
      await instance.patch('/settings', {
        roles: [
          ...settings.roles,
          {
            name: role.name.toLowerCase(),
            permissions: role.permissions
          }
        ]
      });
      success('Role successfully created!');
      await cancelCreateRolesModal();
      await fetchSettings();
    } catch (e: any) {
      error(e.message);
    }
  }, [settings]);

  const actionsButtons = <div className='settings_page_roles_actions'>
    {selectedRole && <Button onClick={openUpdateRolesModal} type='primary' variant='solid'>Update roles</Button>}
    <Button onClick={openCreateRolesModal} type='primary' variant='solid'>Create role</Button>
  </div>

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [])

  return {
    fetchSettings, settings, navigateBack,

    rolesSelection, selectedRole, actionsButtons,

    changeSettingsInput, changeSettingsFile, changeSettingsSwitch,

    cancelUpdateRolesModal, isUpdateRolesModalOpen, updateRoles,
    cancelCreateRolesModal, isCreateRolesModalOpen, addRole,

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

export const getUpdateRolesModalFunction = () => {
  const changeCheckboxes = useCallback(
    (roleName: string, key: string, callback: Dispatch<SetStateAction<IRole[]>>) => {
      return (val: CheckboxChangeEvent) => {
        callback(prev =>
          prev.map(role =>
            role.name === roleName
              ? {
                ...role,
                permissions: val.target.checked
                  ? Array.from(new Set([...(role.permissions || []), key])) // add if not exists
                  : role.permissions.filter(p => p !== key)                  // remove
              }
              : role
          )
        );
      };
    },
    []
  );

  return { changeCheckboxes }
}

export const getCreateRolesFunction = () => {
  const changeRoleName = useCallback((callback: Dispatch<SetStateAction<IRole>>) => {
    return (val: BaseSyntheticEvent) => {
      callback(prev => ({
        ...prev,
        name: val.target.value
      }))
    }
  }, [])

  const togglePermission = useCallback((permission: string, callback: Dispatch<SetStateAction<IRole>>) => {
    return (val: CheckboxChangeEvent) => {
      callback(prev => ({
        ...prev,
        permissions: val.target.checked
          ? Array.from(new Set([...prev.permissions, permission])) // add
          : prev.permissions.filter(p => p !== permission)         // remove
      }));
    }
  }, []);

  return { togglePermission, changeRoleName }
}

const settingsInitialStateTemplate: Omit<ISettings, 'company' | 'roles'> = {
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

export const permissions = [
  'read_policy',
  'update_policy',
  'create_policy',
  'delete_policy',

  'read_customers',
  'create_customers',
  'update_customers',
  'delete_customers',

  'read_customer_details',

  'update_driver',
  'create_driver',
  'delete_driver',

  'update_settings',

  'read_analytics',

  'create_insurances',

  'read_payments',
  'create_payments',
  'delete_payments',

  'send_invoices',
  'read_invoices',

  'read_users',
  'update_users',

  'create_document',

  'read_renewals',

  'read_audit_logs',
];

export const permissionsTypeTexts: { [k: string]: string } = {
  "read_policy": "View Policies",
  "create_policy": "Create Policy",
  "update_policy": "Edit Policy",
  "delete_policy": "Delete Policy",

  "read_customers": "View Customers",
  "create_customers": "Create Customer",
  "update_customers": "Edit Customer",
  "delete_customers": "Delete Customer",
  "read_customer_details": "View Customer Details",

  "create_driver": "Create Driver",
  "update_driver": "Edit Driver",
  "delete_driver": "Delete Driver",

  "update_settings": "Manage Settings",

  "read_analytics": "View Analytics",

  "create_insurances": "Create Insurance",

  "read_payments": "View Payments",
  "create_payments": "Create Payment",
  "delete_payments": "Delete Payment",

  "send_invoices": "Send Invoices",
  "read_invoices": "View Invoices",

  "read_users": "View Users",
  "invite_users": "Invite Users",

  "create_document": "Upload Document",

  "read_renewals": "View Renewals",
  "read_audit_logs": "Read Activity Log"
}


export const settingsInitialState: ISettings = {
  ...settingsInitialStateTemplate,
  roles: [],
  company: {
    logoUrl: '',
    name: '',
    description: ''
  },
}

export const userInitialState: IUser = {
  email: '',
  privilege: 'manager',
  avatarUrl: '',
  permissions: []
}

export const newRoleInitialState: IRole = {
  name: '',
  permissions: []
}

export const newSettingsFormInitialState: ISettingsCreate = {
  ...settingsInitialStateTemplate,
  companyName: '',
  companyDescription: ''
}

