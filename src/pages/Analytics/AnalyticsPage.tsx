import './AnalyticsPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Statistic from "@/components/Statistic/Statistic.tsx";
import Card from "@/components/Card/Card.tsx";
import { ResponsiveLine } from '@nivo/line';
import {
  frequencyRadioOptions, fullyCoveredDueAmountCustomersTableHeaders,
  getAnalyticsFunctions,
  soonestExpiringPoliciesTableHeaders, unpaidPoliciesTableHeaders
} from "@/pages/Analytics/utils/analytics.tsx";
import Table from "@/components/Table/Table.tsx";
import { useEffect } from "react";
import Radio from "@/components/Radio/Radio.tsx";
import dayjs from "dayjs";
import Date from "@/components/Date/Date.tsx";

const AnalyticsPage = () => {
  const {
    kpisCardOptions,
    fetchKpis,
    fetchRevenueByFrequency,
    revenueByFrequency,
    frequency,
    expiringPolicies,
    fetchExpiringPolicies,
    changeFrequency,
    fetchCoveredCustomers,
    coveredCustomers,
    customersSelection,
    unpaidPolicies, fetchUnpaidPolicies
  } = getAnalyticsFunctions()

  useEffect(() => {
    fetchRevenueByFrequency(frequency);
  }, [frequency])

  useEffect(() => {
    fetchKpis();
    fetchExpiringPolicies()
    fetchCoveredCustomers(dayjs().startOf('day'));
    fetchUnpaidPolicies();
  }, []);

  return <Page>
    <div className='analytics_page'>
      <div className='analytics_page_kpis'>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' precision={2} {...kpisCardOptions['totalRevenue']} title='Total Revenue'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' precision={2} {...kpisCardOptions['totalCommissionFee']} title='Total commission fee'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' precision={0} {...kpisCardOptions['activePoliciesCount']} title='Active policies'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' precision={2} {...kpisCardOptions['expiringPoliciesCount']} title='Expiring policies'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' precision={2} {...kpisCardOptions['totalFees']} title='Total fees'/>
        </Card>
      </div>
      <div className='analytics_page_kpis_charts'>
        <div className='analytics_page_kpis_charts_revenue'>
          <div className='analytics_page_kpis_charts_revenue_header'>
            <label className='analytics_page_kpis_charts_revenue_header_title'>{frequency.toUpperCase()} Revenue</label>
            <Radio label='' buttonStyle='solid' block optionType='button' options={frequencyRadioOptions}
                   onChange={changeFrequency} value={frequency}/>
          </div>
          <ResponsiveLine
            data={revenueByFrequency}
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', stacked: true }}
            curve="monotoneX"
            // axisBottom={{ legend: 'Month', legendOffset: 40 }}
            axisLeft={{ legend: 'Value', legendOffset: -50 }}
            enableSlices="x"
          />
        </div>
      </div>
      <div className='analytics_page_tables'>
        <Table actions={<div>
          <Date label='Due Date' onChange={fetchCoveredCustomers}/>
        </div>} rowSelection={customersSelection} rowKey='customerName' label='Fully due amount covered customers'
               dataSource={coveredCustomers}
               columns={fullyCoveredDueAmountCustomersTableHeaders}/>
      </div>
      <div className='analytics_page_tables'>
        <Table actions={<></>} label='All unpaid policies'
               dataSource={unpaidPolicies}
               columns={unpaidPoliciesTableHeaders}/>
      </div>
      <div className='analytics_page_tables'>
        <Table actions={<></>} label='Soonest expiring policies' dataSource={expiringPolicies}
               columns={soonestExpiringPoliciesTableHeaders}/>
      </div>
    </div>
  </Page>
}
export default AnalyticsPage;
