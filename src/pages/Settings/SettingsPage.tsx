import './SettingsPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Input from "@/components/Input/Input.tsx";
import Table from "@/components/Table/Table.tsx";
import Switch from "@/components/Switch/Switch.tsx";
import Radio from "@/components/Radio/Radio.tsx";
import { getSettingsFunctions, settingsRolesTableHeaders } from "@/pages/Settings/utils/settings.tsx";
import AvatarUpload from "@/components/AvatarUpload/AvatarUpload.tsx";
import SettingsSection from "@/pages/Settings/components/SettingsSection/SettingsSection.tsx";
import { useEffect } from "react";
import { getAuthFunctions } from "@/pages/Authorization/utils/auth.ts";
import { Button } from "antd";
import UpdateRolesModal from "@/pages/Settings/components/UpdateRolesModal/UpdateRolesModal.tsx";
import CreateRolesModal from "@/pages/Settings/components/CreateRolesModal/CreateRolesModal.tsx";

const SettingsPage = () => {
  const {
    settings,
    fetchSettings,
    settingsForm,
    updateSettings,
    changeSettingsFile,
    changeSettingsInput,
    changeSettingsSwitch,
    fieldsTouched,

    rolesSelection, actionsButtons,

    isUpdateRolesModalOpen, cancelUpdateRolesModal, updateRoles,
    isCreateRolesModalOpen, addRole, cancelCreateRolesModal
  } = getSettingsFunctions();
  const { user, fetchMyself } = getAuthFunctions();

  useEffect(() => {
    fetchSettings();
    fetchMyself();
  }, []);

  return <Page title='Settings' showSearch={false}>
    <div className='settings_page'>
      <div className='settings_page_container'>
        <div className='settings_page_submit'>
          <Button onClick={updateSettings} disabled={!fieldsTouched}>Save changes</Button>
        </div>
        <SettingsSection label='Profile'>
          <div className='settings_page_profile'>
            {/*<AvatarUpload url={user.avatarUrl}/>*/}
            <div className='settings_page_profile_info'>
              <Input label='E-mail' value={user.email} disabled/>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection label='Company'>
          <div className='settings_page_company'>
            <AvatarUpload url={settings.company.logoUrl} beforeUpload={() => false} multiple={false}
                          onChange={changeSettingsFile}/>
            <div className='settings_page_company_info'>
              <Input label='Company name' onChange={changeSettingsInput('companyName')}
                     value={settingsForm.companyName}/>
              <Input label='Company Description' onChange={changeSettingsInput('companyDescription')}
                     value={settingsForm.companyDescription}/>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection label='Fees & payments'>
          <div className='settings_page_fees_and_payments'>
            <div className='settings_page_fees_and_payments_fees'>
              <Input label='Late fee amount' addonBefore={'$'} onChange={changeSettingsInput('lateFeeAmount')}
                     value={settingsForm.lateFeeAmount}/>
              <Input label='Late fee grace days' addonBefore={'$'} onChange={changeSettingsInput('lateFeeGraceDays')}
                     value={settingsForm.lateFeeGraceDays}/>
            </div>
            <Switch label='Autopay enabled' onChange={changeSettingsSwitch('autopayEnabledByDefault')}
                    value={settingsForm.autopayEnabledByDefault}/>
          </div>
        </SettingsSection>
        <SettingsSection label='Notifications'>
          <div className='settings_page_notifications'>
            <Switch label='Sms notifications enabled' onChange={changeSettingsSwitch('sendSms')}
                    value={settingsForm.sendSms}/>
            <Switch label='E-mail notifications enabled' onChange={changeSettingsSwitch('sendEmail')}
                    value={settingsForm.sendEmail}/>
          </div>
        </SettingsSection>
        <SettingsSection label='Theme'>
          <div className='settings_page_theme'>
            <Radio label='UI Theme' block optionType='button' onChange={changeSettingsInput('theme')}
                   value={settingsForm.theme} defaultValue='light' options={[
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' },
            ]}/>
            <Radio label='Currency' block optionType='button' onChange={changeSettingsInput('currency')}
                   value={settingsForm.currency} defaultValue='usd' options={[
              { label: 'USD', value: 'usd' },
              { label: 'EUR', value: 'eur' },
            ]}/>
            <Radio label='Current Language' block optionType='button' onChange={changeSettingsInput('language')}
                   value={settingsForm.language} defaultValue='en'
                   options={[
                     { label: 'English', value: 'en' },
                     { label: 'Espanol', value: 'es' },
                   ]}/>
          </div>
        </SettingsSection>
      </div>
      <SettingsSection label='Roles'>
        <Table actions={actionsButtons} rowKey='name' rowSelection={rolesSelection} dataSource={settings.roles}
               columns={settingsRolesTableHeaders}/>
      </SettingsSection>
    </div>
    <UpdateRolesModal open={isUpdateRolesModalOpen} submit={updateRoles} cancel={cancelUpdateRolesModal}
                      roles={settings.roles}/>
    <CreateRolesModal open={isCreateRolesModalOpen} submit={addRole} cancel={cancelCreateRolesModal}/>
  </Page>
}

export default SettingsPage;
