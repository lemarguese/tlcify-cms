import './CustomerDetailsPage.scss';

import Page from '../../layout/Page/Page.tsx';
import Table from "../../components/Table/Table.tsx";
import { customerTableHeaders } from "../Customer/utils/customer.tsx";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import CustomerDetailContactSection from "./components/CustomerDetailContactSection/CustomerDetailContactSection.tsx";

import CustomerDetailProfile from "./components/CustomerDetailsProfile/CustomerDetailsProfile.tsx";
import {
  documentTableHeaders,
  getCustomerFunction, getDocumentFunction,
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

const CustomerDetailsPage = () => {

  const navigate = useNavigate();
  const { id: customerId } = useParams();

  const {
    drivers,
    addNewDriverButton,
    fetchDrivers,
    cancelDriverModal,
    createDriver,
    isDriverCreateModalOpen,
    changeDriverFormData,
    changeDriverFormTime
  } = getDriverFunctions(customerId);

  const {
    policies,
    policiesActionButton,
    fetchPolicies,

    // create
    isPolicyCreateModalOpen,
    cancelCreatePolicyModal,
    createPolicy,

    // update
    updatePolicy,
    fetchPolicyById, policyById,
    isPolicyUpdateModalOpen, cancelUpdatePolicyModal,

    // delete
    cancelDeletePolicyModal, deletePolicy, isPolicyDeleteModalOpen,

    // payment
    isPaymentCreateModalOpen, cancelPaymentCreateModal, createPayment,

    // common
    ...commonPolicyFunctions
  } = getPolicyFunctions(customerId);

  const {
    isClientEmailModalOpen, changeAutoPay,
    openClientFormEmail, sendFormToClientEmail, isAutoPayEnabled,
    cancelClientFormSend,
    customerById, contactSections, fetchCustomerById,
  } = getCustomerFunction(customerId);

  const {
    fetchDocumentsByCustomerId,
    documents,
    uploadCustomerDocument,
    isDocumentModalOpen,
    cancelDocumentModal,

    addNewDocumentButton
  } = getDocumentFunction(customerId);

  useEffect(() => {
    fetchCustomerById();
    fetchDrivers();
    fetchPolicies();
    fetchDocumentsByCustomerId();
  }, []);

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
            <div className='customer_details_page_autopay_switch'>
              <p className='customer_details_page_autopay_switch_text'>Setup Autopay</p>
              <Switch onChange={changeAutoPay} value={isAutoPayEnabled}/>
            </div>
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
                                        title='Total amount of payments' description={'300'}/>
          <CustomerDetailStatisticsItem key={`customer-details-page-statistics-item-next-due`} title='Next due amount'
                                        description={'300'}/>
          <CustomerDetailStatisticsItem key={`customer-details-page-statistics-item-total-fee`}
                                        title='Total amount of fees' description={'300'}/>
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
          navigate(`/policy/${item._id}`);
        },
      })}/>
      <Table label='Drivers' rowKey='_id' actions={addNewDriverButton} columns={customerTableHeaders}
             dataSource={drivers}/>
    </div>
    <DriverCreateModal formChange={changeDriverFormData} dateChange={changeDriverFormTime} cancel={cancelDriverModal}
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
  </Page>
}

export default CustomerDetailsPage;
