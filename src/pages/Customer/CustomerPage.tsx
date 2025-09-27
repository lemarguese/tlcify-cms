import './CustomerPage.scss';

import Table from "../../components/Table/Table.tsx";
import Page from "../../layout/Page/Page.tsx";

import { useEffect } from "react";
import type { ICustomer } from "@/types/customer/main.ts";
import { customerTableHeaders, getCustomerFunctions } from "./utils/customer.tsx";
import CustomerCreateModal from "@/pages/Customer/components/CustomerCreateModal/CustomerCreateModal.tsx";
import CustomerUpdateModal from "@/pages/Customer/components/CustomerUpdateModal/CustomerUpdateModal.tsx";
import { getAuthFunctions } from "@/pages/Authorization/utils/auth.ts";
import Permission from "@/layout/Permission/Permission.tsx";
import { Button } from "antd";
import CustomerDeleteModal from "@/pages/Customer/components/CustomerDeleteModal/CustomerDeleteModal.tsx";

const CustomerPage = () => {
  const {
    fetchCustomers,
    customers,
    customersSelection,
    handleSearchQuery,
    onSearch,
    isCreateModalOpen,
    isUpdateModalOpen,
    navigateToCustomerDetail,
    searchQuery,
    selectedCustomer,

    createCustomer, updateCustomer,

    cancelCreateCustomerModal, cancelUpdateCustomerModal,
    openCreateCustomerModal, openUpdateCustomerModal,

    cancelDeleteCustomerModal, deleteCustomer, isDeleteModalOpen, openDeleteCustomerModal,
    loading
  } = getCustomerFunctions();

  const { fetchMyself, user } = getAuthFunctions();

  useEffect(() => {
    fetchCustomers();
    fetchMyself();
  }, []);

  const customersTableActions = (
    <div className='customer_page_actions'>
      {
        selectedCustomer && <Permission user_permission={user.permissions} permission="delete_customers">
              <Button onClick={openDeleteCustomerModal} color='danger' variant='solid'>Delete the customer</Button>
          </Permission>
      }
      {
        selectedCustomer && <Permission user_permission={user.permissions} permission="update_customers">
              <Button onClick={openUpdateCustomerModal} color='orange' variant='solid'>Update the customer</Button>
          </Permission>
      }
      <Permission user_permission={user.permissions} permission="create_customers">
        <Button onClick={openCreateCustomerModal} type='primary' variant='solid'>Create customer</Button>
      </Permission>
    </div>
  );

  return <Page loading={loading} title='Customers' showSearch onSearchChange={handleSearchQuery} onSearchPress={onSearch}
               searchQuery={searchQuery}>
    <div className='customer_page'>
      <Table columns={customerTableHeaders} rowSelection={customersSelection} onRow={(item) => {
        return {
          onClick: () => navigateToCustomerDetail(item as ICustomer),
        }
      }} dataSource={customers} rowKey='_id' label='Customers List' actions={customersTableActions}/>
    </div>
    <CustomerCreateModal open={isCreateModalOpen} submit={createCustomer} cancel={cancelCreateCustomerModal}/>
    <CustomerUpdateModal open={isUpdateModalOpen} submit={updateCustomer} cancel={cancelUpdateCustomerModal}
                         selectedCustomer={selectedCustomer}/>
    <CustomerDeleteModal open={isDeleteModalOpen} cancel={cancelDeleteCustomerModal} submit={deleteCustomer}/>
  </Page>
}

export default CustomerPage;
