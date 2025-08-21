import './RenewalPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";
import { getRenewalsFunction, renewalTableHeaders } from "@/pages/Renewal/utils/renewal.tsx";
import { useEffect } from "react";

const RenewalPage = () => {
  const { fetchRenewalsOfCustomers, renewals, actions, renewalsFilters } = getRenewalsFunction();

  useEffect(() => {
    fetchRenewalsOfCustomers(renewalsFilters);
  }, [renewalsFilters])

  return <Page showSearch>
    <div className='renewals_page'>
      <Table label='Renewals' actions={actions} columns={renewalTableHeaders} dataSource={renewals}/>
    </div>
  </Page>
}

export default RenewalPage;
