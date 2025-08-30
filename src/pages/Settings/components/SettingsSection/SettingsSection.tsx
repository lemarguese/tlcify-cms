import './SettingsSection.scss';

import type { ReactNode } from "react";

interface SettingsSectionProps {
  label: string;
  children: ReactNode
}

const SettingsSection = ({ label, children }: SettingsSectionProps) => {
  return <div className='settings_section'>
    <div className='settings_section_header'>
      <label className='settings_section_header_label'>{label}</label>
    </div>
    {children}
  </div>
}

export default SettingsSection;
