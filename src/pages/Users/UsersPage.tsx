import './UsersPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";
import { getUsersFunction, usersTableHeaders } from "@/pages/Users/utils/users.tsx";
import { useEffect } from "react";
import UserInviteModal from "@/pages/Users/components/UserInviteModal/UserInviteModal.tsx";

const UsersPage = () => {

  const {
    users,
    fetchUsers,
    inviteUser,
    cancelInvitationModal,
    isUserInvitationModalOpen,
    userTableActions
  } = getUsersFunction();

  useEffect(() => {
    fetchUsers();
  }, []);

  return <Page showSearch={false}>
    <div className='users_page'>
      <Table label='Users' actions={userTableActions} columns={usersTableHeaders} dataSource={users}/>
    </div>
    <UserInviteModal open={isUserInvitationModalOpen} cancel={cancelInvitationModal} submit={inviteUser}/>
  </Page>
}

export default UsersPage;
