import './UpdateRolesModal.scss';

import Modal from "@/components/Modal/Modal.tsx";
import type { IRole } from "@/types/settings/main.ts";
import Checkbox from "@/components/Checkbox/Checkbox.tsx";
import {
  getUpdateRolesModalFunction, permissions,
  permissionsTypeTexts,
} from "@/pages/Settings/utils/settings.tsx";
import { useEffect, useState } from "react";

interface UpdateRolesModalProps {
  open: boolean;
  submit: (val: IRole[]) => void;
  cancel: () => void;
  roles: IRole[];
}

const UpdateRolesModal = ({ open, cancel, submit, roles }: UpdateRolesModalProps) => {
  const [newRoles, setNewRoles] = useState<IRole[]>([]);
  const { changeCheckboxes } = getUpdateRolesModalFunction();

  useEffect(() => {
    setNewRoles(roles)
  }, [roles]);

  return <Modal open={open} onCancel={cancel} onOk={() => submit(newRoles)}>
    <div className='settings_update_roles_modal'>
      {roles.map(role => {
        return <div className='settings_update_roles_modal_section'>
          <label>{role.name}</label>
          <div className='settings_update_roles_modal_item'>
            {permissions.map(p => {
              return <Checkbox checked={
                (() => {
                  const findRole = newRoles.find(r => r.name === role.name);
                  return findRole ? findRole.permissions.includes(p) : false;
                })()
              } label={permissionsTypeTexts[p]} onChange={changeCheckboxes(role.name, p, setNewRoles)}/>
            })}
          </div>
        </div>
      })}
    </div>
  </Modal>
}

export default UpdateRolesModal;
