import './InsurancePage.scss';

import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";
import { getInsuranceFunctions, insuranceTableHeaders } from "@/pages/Insurance/utils/insurance.tsx";
import { useEffect } from "react";
import InsuranceCreateModal from "@/pages/Insurance/components/InsuranceCreateModal/InsuranceCreateModal.tsx";

const InsurancePage = () => {

  const {
    fetchInsurances,
    isInsuranceModalOpen,
    insurances,
    submitForm,
    addNewInsuranceButton,
    cancelInsuranceModal,
    changeInsuranceFormData
  } = getInsuranceFunctions();

  useEffect(() => {
    fetchInsurances();
  }, []);

  return <Page title='Insurances' showSearch>
    <div className='insurance_page'>
      <Table actions={addNewInsuranceButton} label='Insurance carriers list' columns={insuranceTableHeaders}
             dataSource={insurances}/>
      <InsuranceCreateModal open={isInsuranceModalOpen} cancel={cancelInsuranceModal} submit={submitForm}
                            formChange={changeInsuranceFormData}/>
    </div>
  </Page>
}

export default InsurancePage;
