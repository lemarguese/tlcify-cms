import './RenewalPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";
import { getRenewalsFunction, renewalTableHeaders } from "@/pages/Renewal/utils/renewal.tsx";
import { useEffect } from "react";
import dayjs from "dayjs";
import Range from "@/components/Range/Range.tsx";
import Button from "@/components/Button/Button.tsx";

const RenewalPage = () => {
  const {
    fetchRenewalsOfCustomers,
    navigateToCustomerDetails,
    renewals,
    renewalsFilters,
    changeQueryDate,
    resetFilters
  } = getRenewalsFunction();

  useEffect(() => {
    fetchRenewalsOfCustomers();
  }, []);

  return <Page title='Renewals' showSearch>
    <div className='renewals_page'>
      <div className='renewals_page_actions'>
        <div className='renewals_page_actions_left'></div>
        <div className='renewals_page_actions_right'>
          <label className='renewals_page_actions_right_label'>Filters</label>
          <div className='renewals_page_actions_right_filters'>
            <Range label='TLC (FHV) Expiration'
                   value={[
                     renewalsFilters ? renewalsFilters.tlcFhvExpirationFrom ? dayjs(renewalsFilters.tlcFhvExpirationFrom) : null : null,
                     renewalsFilters ? renewalsFilters.tlcFhvExpirationTo ? dayjs(renewalsFilters.tlcFhvExpirationTo) : null : null,
                   ]}
                   onChange={changeQueryDate('tlcFhvExpiration')}/>
            <Range label='Registration Expiration'
                   value={[
                     renewalsFilters ? renewalsFilters.dmvExpirationFrom ? dayjs(renewalsFilters.dmvExpirationFrom) : null : null,
                     renewalsFilters ? renewalsFilters.dmvExpirationTo ? dayjs(renewalsFilters.dmvExpirationTo) : null : null
                   ]}
                   onChange={changeQueryDate('dmvExpiration')}/>
            <Range label='DDC. Expiration'
                   value={[
                     renewalsFilters ? renewalsFilters.ddcExpFrom ? dayjs(renewalsFilters.ddcExpFrom) : null : null,
                     renewalsFilters ? renewalsFilters.ddcExpTo ? dayjs(renewalsFilters.ddcExpTo) : null : null,
                   ]}
                   onChange={changeQueryDate('ddcExp')}/>
            <div className='renewals_page_actions_right_filters_actions'>
              <Button onClick={() => fetchRenewalsOfCustomers(renewalsFilters)}>Apply Filters</Button>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          </div>
        </div>
      </div>
      <Table label='Renewals' actions={<></>} onRow={(item) => {
        return {
          onClick: () => {
            navigateToCustomerDetails(item._id)
          }
        }
      }} columns={renewalTableHeaders} dataSource={renewals}/>
    </div>
  </Page>
}

export default RenewalPage;
