import './CustomerDetailsPage.scss';

import Page from '../../layout/Page/Page.tsx';
import Table from "../../components/Table/Table.tsx";
import { customerTableHeaders } from "../Customer/utils/customer.tsx";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";

import CustomerDetailContactSection from "./components/CustomerDetailContactSection/CustomerDetailContactSection.tsx";

import CustomerDetailProfile from "./components/CustomerDetailsProfile/CustomerDetailsProfile.tsx";
import {
  documentTableHeaders, getCustomerByIdFunction,
  getDocumentFunction,
  getPolicyFunctions,
  policyTableHeaders
} from "@/pages/CustomerDetails/utils/policy.tsx";
import DriverCreateModal from "@/pages/CustomerDetails/components/DriverCreateModal/DriverCreateModal.tsx";
import PolicyCreateModal from "@/pages/CustomerDetails/components/PolicyCreateModal/PolicyCreateModal.tsx";
import { getDriverFunctions } from "@/pages/CustomerDetails/utils/driver.tsx";
import PolicyUpdateModal from "@/pages/CustomerDetails/components/PolicyUpdateModal/PolicyUpdateModal.tsx";
import PolicyDeleteModal from "@/pages/CustomerDetails/components/PolicyDeleteModal/PolicyDeleteModal.tsx";
import CustomerDetailStatisticsItem
  from "@/pages/CustomerDetails/components/CustomerDetailStatisticsItem/CustomerDetailStatisticsItem.tsx";
import Switch from "@/components/Switch/Switch.tsx";
import Button from "@/components/Button/Button.tsx";
import ClientEmailModal from "@/pages/CustomerDetails/components/ClientEmailModal/ClientEmailModal.tsx";
import DocumentCreateModal from "@/pages/CustomerDetails/components/DocumentCreateModal/DocumentCreateModal.tsx";
import PaymentCreateModal from "@/pages/CustomerDetails/components/PaymentCreateModal/PaymentCreateModal.tsx";
import InvoiceCreateModal from "@/pages/CustomerDetails/components/InvoiceCreateModal/InvoiceCreateModal.tsx";
import { SendOutlined } from "@ant-design/icons";
import { getAuthFunctions } from "@/pages/Authorization/utils/auth.ts";
import Permission from "@/layout/Permission/Permission.tsx";

const CustomerDetailsPage = () => {

  const navigate = useNavigate();
  const { customerId } = useParams();

  const { user, fetchMyself } = getAuthFunctions();

  const {
    drivers,
    fetchDrivers,
    cancelDriverModal,
    createDriver,
    isDriverCreateModalOpen,
    openDriverModal
  } = getDriverFunctions(customerId);

  const {
    policies,
    selectedPolicy,
    fetchPolicies,

    // create
    isPolicyCreateModalOpen,
    cancelCreatePolicyModal,
    createPolicy, openCreatePolicyModal,

    // update
    updatePolicy,
    fetchPolicyById, policyById,
    isPolicyUpdateModalOpen, cancelUpdatePolicyModal, openUpdatePolicyModal,

    // delete
    cancelDeletePolicyModal, deletePolicy, isPolicyDeleteModalOpen, openDeletePolicyModal,

    // payment
    isPaymentCreateModalOpen, cancelPaymentCreateModal, createPayment, openPaymentCreateModal,

    // invoice
    cancelInvoiceCreateModal, isInvoiceConfirmModalOpen, createInvoice, openInvoiceCreateModal,

    // statistics
    totalFeesAmount, totalPaymentAmount, nextDueAmount,

    // common
    ...commonPolicyFunctions
  } = getPolicyFunctions(customerId);

  const {
    isClientEmailModalOpen, changeAutoPay,
    openClientFormEmail, sendFormToClientEmail, isAutoPayEnabled,
    cancelClientFormSend,
    customerById, contactSections, fetchCustomerById,
  } = getCustomerByIdFunction(customerId);

  const {
    fetchDocumentsByCustomerId,
    documents,
    uploadCustomerDocument,
    isDocumentModalOpen,
    cancelDocumentModal,
    openDocumentModal
  } = getDocumentFunction(customerId);

  useEffect(() => {
    fetchCustomerById();
    fetchDrivers();
    fetchPolicies();
    fetchDocumentsByCustomerId();
    fetchMyself();
  }, []);

  const addNewDriverButton = <Permission permission='create_driver' user_permission={user.permissions}>
    <Button onClick={openDriverModal}>Create Driver</Button>
  </Permission>

  const addNewDocumentButton =
    <Permission permission='create_document' user_permission={user.permissions}>
      <Button variant='outlined' onClick={openDocumentModal}>Add
        Document</Button>
    </Permission>

  const policiesActionButton = <div className='customer_details_page_actions'>
    <Permission permission='delete_policy' user_permission={user.permissions}>
      {selectedPolicy &&
          <Button variant='outlined' color={'danger'} onClick={openDeletePolicyModal}>Delete the
              policy</Button>}
    </Permission>
    <Permission permission='update_policy' user_permission={user.permissions}>
      {selectedPolicy && <Button onClick={openUpdatePolicyModal}>Update the policy</Button>}
    </Permission>
    <Permission permission='create_payments' user_permission={user.permissions}>
      {selectedPolicy && <Button color={'magenta'} variant='solid' onClick={openPaymentCreateModal}>Create
          payment</Button>}
    </Permission>
    <Permission permission='create_policy' user_permission={user.permissions}>
      <Button variant='outlined' color={'geekblue'} onClick={openCreatePolicyModal}>Add policy</Button>
    </Permission>
    <Permission permission='send_invoices' user_permission={user.permissions}>
      <Button variant='solid' color='green' icon={<SendOutlined/>} onClick={openInvoiceCreateModal}>Send
        invoice</Button>
    </Permission>
  </div>

  return <Page back={() => navigate(-1)} showSearch={false}>
    <div className='customer_details_page'>
      <div className='customer_details_page_container'>
        <div className='customer_details_page_contacts'>
          {contactSections.map(contactSection => (<CustomerDetailContactSection
            key={`customer-detail-contact-section-${contactSection.title}`} {...contactSection} />))}
        </div>
        <div className='customer_details_page_autopay'>
          <label className='customer_details_page_autopay_title'>Autopay options</label>
          <div className='customer_details_page_autopay_container'>
            <Switch label='Setup AutoPay' onChange={changeAutoPay} value={isAutoPayEnabled}/>
            <div className='customer_details_page_autopay_actions'>
              <Button variant='solid' disabled={!isAutoPayEnabled} onClick={openClientFormEmail}
                      className='customer_details_page_autopay_actions_button'>Send form to a client</Button>
              <Button variant='solid' disabled={!isAutoPayEnabled}
                      onClick={() => navigate(`/billing/${customerId}`)}
                      className='customer_details_page_autopay_actions_button'>Fill out the form for the
                client</Button>
            </div>
          </div>
        </div>
        <div className='customer_details_page_statistics'>
          <CustomerDetailStatisticsItem key={`customer-details-page-statistics-item-total-amount`}
                                        title='Total amount of payments' description={totalPaymentAmount}/>
          <CustomerDetailStatisticsItem key={`customer-details-page-statistics-item-next-due`} title='Next due amount'
                                        description={nextDueAmount}/>
          <CustomerDetailStatisticsItem key={`customer-details-page-statistics-item-total-fee`}
                                        title='Total amount of fees' description={totalFeesAmount}/>
        </div>
        <CustomerDetailProfile
          firstName={customerById.firstName}
          dateOfBirth={customerById.dateOfBirth}
          lastName={customerById.lastName}
          phoneNumber={customerById.phoneNumber}
        />
      </div>
      <Table label='Documents' actions={addNewDocumentButton} columns={documentTableHeaders} dataSource={documents}
             rowKey='_id'/>
      <Table label='Policy' rowSelection={commonPolicyFunctions.policiesSelection} rowKey='_id'
             actions={policiesActionButton} columns={policyTableHeaders} dataSource={policies} onRow={(item) => ({
        onClick: () => {
          navigate(`policy/${item._id}`);
        },
      })}/>
      <Table label='Drivers' rowKey='_id' actions={addNewDriverButton} columns={customerTableHeaders}
             dataSource={drivers}/>
    </div>
    <DriverCreateModal cancel={cancelDriverModal}
                       open={isDriverCreateModalOpen} submit={createDriver}/>
    <PolicyCreateModal open={isPolicyCreateModalOpen} cancel={cancelCreatePolicyModal}
                       submit={createPolicy} {...commonPolicyFunctions} />
    <PolicyUpdateModal open={isPolicyUpdateModalOpen} cancel={cancelUpdatePolicyModal} submit={updatePolicy}
                       policyById={policyById}
                       fetchPolicyById={fetchPolicyById} {...commonPolicyFunctions}/>
    <PolicyDeleteModal open={isPolicyDeleteModalOpen} submit={deletePolicy} cancel={cancelDeletePolicyModal}/>
    <ClientEmailModal open={isClientEmailModalOpen} submit={sendFormToClientEmail} cancel={cancelClientFormSend}/>
    <DocumentCreateModal open={isDocumentModalOpen} cancel={cancelDocumentModal} submit={uploadCustomerDocument}/>
    <PaymentCreateModal open={isPaymentCreateModalOpen} submit={createPayment} cancel={cancelPaymentCreateModal}/>
    <InvoiceCreateModal open={isInvoiceConfirmModalOpen} cancel={cancelInvoiceCreateModal}
                        submit={() => createInvoice(navigate)}
    />
  </Page>
}

export default CustomerDetailsPage;
