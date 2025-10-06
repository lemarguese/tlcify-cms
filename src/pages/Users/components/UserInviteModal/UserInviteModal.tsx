import './UserInviteModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import { BaseSyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { IUser } from "@/types/user/main.ts";
import Input from "@/components/Input/Input.tsx";
import Selector from "@/components/Selector/Selector.tsx";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import { getSettingsFunctions } from "@/pages/Settings/utils/settings.tsx";
import { isValidEmail } from "@/utils/common.ts";

interface UserInviteModalProps {
  open: boolean;
  submit: (value: Pick<IUser, 'email' | 'privilege'>) => void;
  cancel: () => void;
}

const UserInviteModal = ({ open, cancel, submit }: UserInviteModalProps) => {
  const { error, success } = useNotify();
  const { settings, fetchSettings } = getSettingsFunctions();

  useEffect(() => {
    if (open) fetchSettings();
  }, [open])

  const [userInvitationForm, setUserInvitationForm] = useState<Pick<IUser, 'email' | 'privilege'>>({
    email: '',
    privilege: ''
  });

  const rolesSelection = useMemo(() => settings.roles.map(role => ({
    value: role.name,
    label: role.name
  })), [settings]);

  const changeInputs = useCallback((key: 'email' | 'privilege') => {
    return (val: string | BaseSyntheticEvent) => {
      setUserInvitationForm(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value
      }))
    }
  }, []);

  const sendInvite = () => {
    if (!isValidEmail(userInvitationForm.email)) {
      error('Not valid email!');
      return
    }

    submit(userInvitationForm);
  }

  return <Modal open={open} onOk={sendInvite} onCancel={cancel}>
    <div className='user_invite_modal'>
      <Input label='User E-mail' onChange={changeInputs('email')} value={userInvitationForm.email}/>
      <Selector label='User role' onChange={changeInputs('privilege')} value={userInvitationForm.privilege}
                options={rolesSelection}/>
    </div>
  </Modal>
}

export default UserInviteModal;
