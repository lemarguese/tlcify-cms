import { useCallback, useState } from "react";
import type { IUser } from "@/types/user/main.ts";
import { instance } from "@/api/axios.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import type { AxiosError } from "axios";
import type { ColumnsType } from "antd/es/table";
import Button from "@/components/Button/Button.tsx";

export const usersTableHeaders: ColumnsType = [
  {
    dataIndex: 'fullName', key: 'fullName', title: 'Full Name', render: (_, record) => {
      return `${record.firstName} ${record.lastName}`
    }
  },
  { dataIndex: 'email', key: 'email', title: 'Email' },
  { dataIndex: 'privilege', key: 'privilege', title: 'Privilege' },
  { dataIndex: 'createdAt', key: 'createdAt', title: 'User Created Date' },
];

export const getUsersFunction = () => {
  const { error, success } = useNotify();
  const [users, setUsers] = useState<IUser[]>([]);

  const [isUserInvitationModalOpen, setIsUserInvitationModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await instance.get('/user');
      setUsers(response.data);
    } catch (e: unknown) {
      error((e as AxiosError).message);
    }
  }

  const cancelInvitationModal = useCallback(() => {
    setIsUserInvitationModalOpen(false);
  }, []);

  const inviteUser = useCallback(async (value: Pick<IUser, 'email' | 'privilege'>) => {
    try {
      await instance.post('/email/invite-user', value);
      success('Invitation email successfully sent!');
    } catch (e: unknown) {
      error((e as AxiosError).message);
    }
    cancelInvitationModal();
  }, []);

  const userTableActions = <div>
    <Button variant='solid' type='primary' color='green' onClick={() => setIsUserInvitationModalOpen(true)}>Invite
      User</Button>
  </div>

  return { users, fetchUsers, inviteUser, userTableActions, cancelInvitationModal, isUserInvitationModalOpen }
}
