import './CreateRolesModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import type { IRole } from "@/types/settings/main.ts";
import { useState } from "react";
import {
  getCreateRolesFunction,
  newRoleInitialState,
  permissions,
  permissionsTypeTexts
} from "@/pages/Settings/utils/settings.tsx";
import Input from "@/components/Input/Input.tsx";
import Checkbox from "@/components/Checkbox/Checkbox.tsx";

interface CreateRolesModalProps {
  open: boolean;
  submit: (role: IRole) => void;
  cancel: () => void;
}

const CreateRolesModal = ({ open, submit, cancel }: CreateRolesModalProps) => {
  const [newRole, setNewRole] = useState<IRole>(newRoleInitialState);
  const { togglePermission, changeRoleName } = getCreateRolesFunction()

  return <Modal open={open} onOk={() => submit(newRole)} onCancel={cancel}>
    <div className='settings_create_roles_modal'>
      <Input label='Role name' onChange={changeRoleName(setNewRole)}/>
      <div className='settings_create_roles_modal_permissions'>
        <label className='settings_create_roles_modal_permissions_title'>Permissions</label>
        <div className='settings_create_roles_modal_permissions_list'>
          {permissions.map(p => <Checkbox onChange={togglePermission(p, setNewRole)}
                                          checked={newRole.permissions.includes(p)} label={permissionsTypeTexts[p]}/>)}
        </div>
      </div>
    </div>
  </Modal>
}

export default CreateRolesModal;
