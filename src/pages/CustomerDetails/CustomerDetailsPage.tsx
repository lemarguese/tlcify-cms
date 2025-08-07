import './CustomerDetailsPage.scss';

import Page from '../../layout/Page/Page.tsx';
import Table from "../../components/Table/Table.tsx";
import { customerTableHeaders, newCustomerFormInitialState } from "../Customer/utils/customer.tsx";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { instance } from "@/api/axios.ts";

import CustomerDetailContactSection from "./components/CustomerDetailContactSection/CustomerDetailContactSection.tsx";

import EmailIcon from '../../assets/icons/email_icon.svg';
import RegisteredIcon from '../../assets/icons/registered_icon.svg';
import type { ICustomerCreate } from "@/types/customer/main.ts";
import CustomerDetailProfile from "./components/CustomerDetailsProfile/CustomerDetailsProfile.tsx";
import { getPolicyFunctions, policyTableHeaders } from "@/pages/CustomerDetails/utils/policy.tsx";
import DriverCreateModal from "@/pages/CustomerDetails/components/DriverCreateModal/DriverCreateModal.tsx";
import PolicyCreateModal from "@/pages/CustomerDetails/components/PolicyCreateModal/PolicyCreateModal.tsx";
import { getDriverFunctions } from "@/pages/CustomerDetails/utils/driver.tsx";
import PolicyUpdateModal from "@/pages/CustomerDetails/components/PolicyUpdateModal/PolicyUpdateModal.tsx";
import PolicyDeleteModal from "@/pages/CustomerDetails/components/PolicyDeleteModal/PolicyDeleteModal.tsx";

const CustomerDetailStatisticsItem = () => {
  return <div className='customer_details_page_statistics_item'>
    <div className='customer_details_page_statistics_item_header'>
      <div className='customer_details_page_statistics_item_header_icon_block'>
        <div className='customer_details_page_statistics_item_header_icon_block_icon'/>
        <p>Total Points</p>
      </div>
      <p>300</p>
    </div>
    <div className='customer_details_page_statistics_item_footer'>
      <div className='customer_details_page_statistics_item_footer_content'>
        <h6>Points Used</h6>
        <p>150</p>
      </div>
      <div className='customer_details_page_statistics_item_footer_content'>
        <h6>Points Used</h6>
        <p>150</p>
      </div>
    </div>
  </div>
}

const CustomerDetailsPage = () => {

  const { id: customerId } = useParams();

  const navigate = useNavigate();

  const [customerById, setCustomerById] = useState<ICustomerCreate>(newCustomerFormInitialState);

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

    //create
    isPolicyCreateModalOpen,
    cancelCreatePolicyModal,
    createPolicy,

    // update
    updatePolicy,
    fetchPolicyById, policyById,
    isPolicyUpdateModalOpen, cancelUpdatePolicyModal,

    // delete
    cancelDeletePolicyModal, deletePolicy, isPolicyDeleteModalOpen,

    // common
    ...commonPolicyFunctions
  } = getPolicyFunctions(customerId);

  useEffect(() => {
    fetchCustomerById();
    fetchDrivers();
    fetchPolicies();
  }, []);

  const fetchCustomerById = useCallback(async () => {
    const customer = await instance.get(`/customer/${customerId}`);
    setCustomerById(customer.data);
  }, [customerId]);

  const contactSections = [
    { title: 'Email', content: customerById.email, backgroundColor: '#FFF5E0', iconUrl: EmailIcon },
    { title: 'Email', content: customerById.email, backgroundColor: '#FFF5E0', iconUrl: EmailIcon },
    { title: 'Register Since', content: customerById.tlcExp, backgroundColor: '#E7D1F8', iconUrl: RegisteredIcon },
    { title: 'Register Since', content: customerById.tlcExp, backgroundColor: '#E7D1F8', iconUrl: RegisteredIcon },
  ];

  return <Page back={() => navigate(-1)} showSearch={false}>
    <div className='customer_details_page'>
      <div className='customer_details_page_container'>
        <div className='customer_details_page_contacts'>
          {contactSections.map(contactSection => (<CustomerDetailContactSection
            key={`customer-detail-contact-section-${contactSection.title}`} {...contactSection} />))}
        </div>
        <div className='customer_details_page_statistics'>
          <CustomerDetailStatisticsItem key={`1`}/>
          <CustomerDetailStatisticsItem key={`2`}/>
          <CustomerDetailStatisticsItem key={`3`}/>
        </div>
        <CustomerDetailProfile
          firstName={customerById.firstName}
          dateOfBirth={customerById.dateOfBirth}
          lastName={customerById.lastName}
          phoneNumber={customerById.phoneNumber}
        />
      </div>
      <Table label='Policy' rowSelection={commonPolicyFunctions.policiesSelection} rowKey='_id'
             actions={policiesActionButton} columns={policyTableHeaders} dataSource={policies} onRow={(item) => ({
        onClick: () => {
          navigate(`/policy/${item._id}`)
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
  </Page>
}

export default CustomerDetailsPage;
