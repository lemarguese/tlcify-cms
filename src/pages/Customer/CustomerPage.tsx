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
    openCreateCustomerModal, openUpdateCustomerModal
  } = getCustomerFunctions();

  const { fetchMyself, user } = getAuthFunctions();

  useEffect(() => {
    fetchCustomers();
    fetchMyself();
  }, []);

  const customersTableActions = (
    <div>
      <Permission user_permission={user.permissions} permission="update_customers">
        {selectedCustomer && (
          <Button onClick={openUpdateCustomerModal}>Update the customer</Button>
        )}
      </Permission>

      <Permission user_permission={user.permissions} permission="create_customers">
        <Button onClick={openCreateCustomerModal}>Create customer</Button>
      </Permission>
    </div>
  );

  return <Page title='Customers' showSearch onSearchChange={handleSearchQuery} onSearchPress={onSearch}
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
  </Page>
}

export default CustomerPage;
