import './AnalyticsPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Statistic from "@/components/Statistic/Statistic.tsx";
import Card from "@/components/Card/Card.tsx";
import { ArrowUpOutlined } from '@ant-design/icons';
import { ResponsiveLine } from '@nivo/line';
import {
  frequencyRadioOptions, fullyCoveredDueAmountCustomersTableHeaders,
  getAnalyticsFunctions,
  soonestExpiringPoliciesTableHeaders
} from "@/pages/Analytics/utils/analytics.tsx";
import Table from "@/components/Table/Table.tsx";
import { useEffect } from "react";
import Radio from "@/components/Radio/Radio.tsx";
import dayjs from "dayjs";
import Date from "@/components/Date/Date.tsx";

const AnalyticsPage = () => {
  const {
    kpis,
    fetchKpis,
    fetchRevenueByFrequency,
    revenueByFrequency,
    frequency,
    expiringPolicies,
    fetchExpiringPolicies,
    changeFrequency,
    fetchCoveredCustomers,
    coveredCustomers
  } = getAnalyticsFunctions()

  useEffect(() => {
    fetchRevenueByFrequency(frequency);
  }, [frequency])

  useEffect(() => {
    fetchKpis();
    fetchExpiringPolicies()
    fetchCoveredCustomers(dayjs())
  }, []);

  return <Page title='Analytics'>
    <div className='analytics_page'>
      <div className='analytics_page_kpis'>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' value={kpis.totalRevenue} prefix={<div>
            <ArrowUpOutlined/>
            $
          </div>} valueStyle={{ color: '#3f8600' }} title='Total Revenue'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' valueStyle={{ color: '#3f8600' }}
                     value={kpis.totalCommissionFee}
                     prefix={<div>
                       <ArrowUpOutlined/>
                       $
                     </div>}
                     title='Total commission fee'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' valueStyle={{ color: '#3f8600' }}
                     value={kpis.activePoliciesCount}
                     prefix={<ArrowUpOutlined/>}
                     title='Active policies'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' valueStyle={{ color: '#3f8600' }}
                     value={kpis.expiringPoliciesCount}
                     prefix={<ArrowUpOutlined/>}
                     title='Expiring policies'/>
        </Card>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' valueStyle={{ color: '#3f8600' }} value={kpis.totalFees}
                     prefix={<div>
                       <ArrowUpOutlined/>
                       $
                     </div>}
                     title='Total fees'/>
        </Card>
      </div>
      <div className='analytics_page_kpis_charts'>
        <div className='analytics_page_kpis_charts_revenue'>
          <div className='analytics_page_kpis_charts_revenue_header'>
            <label className='analytics_page_kpis_charts_revenue_header_title'>Revenue by Month</label>
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
        </div>} label='Fully due amount covered customers' dataSource={coveredCustomers}
               columns={fullyCoveredDueAmountCustomersTableHeaders}/>
      </div>
      <div className='analytics_page_tables'>
        <Table actions={<></>} label='Soonest expiring policies' dataSource={expiringPolicies}
               columns={soonestExpiringPoliciesTableHeaders}/>
      </div>
    </div>
  </Page>
}
export default AnalyticsPage;
