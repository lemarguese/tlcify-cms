import './AnalyticsPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Statistic from "@/components/Statistic/Statistic.tsx";
import Card from "@/components/Card/Card.tsx";
import { ArrowUpOutlined } from '@ant-design/icons';
import { ResponsiveLine } from '@nivo/line';
import {
  getAnalyticsFunctions,
  soonestExpiringPoliciesTableHeaders
} from "@/pages/Analytics/utils/analytics.tsx";
import Table from "@/components/Table/Table.tsx";
import { useEffect } from "react";


const AnalyticsPage = () => {
  const { kpis, fetchKpis, fetchRevenueByFrequency, revenueByFrequency, frequency } = getAnalyticsFunctions()

  useEffect(() => {
    fetchRevenueByFrequency(frequency);
    fetchKpis();
  }, [frequency])

  return <Page title='Analytics'>
    <div className='analytics_page'>
      <div className='analytics_page_kpis'>
        <Card variant="borderless" className='analytics_page_kpis_card'>
          <Statistic className='analytics_page_kpis_card_item' value={kpis.totalRevenue} prefix={<div>
            <ArrowUpOutlined/>
            $
          </div>}
                     valueStyle={{ color: '#3f8600' }} title='Total Revenue'/>
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
          <label className='analytics_page_kpis_charts_revenue_title'>Revenue by Month</label>
          <ResponsiveLine
            data={revenueByFrequency}
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', stacked: true }}
            curve="monotoneX"
            // axisBottom={{ legend: 'Month', legendOffset: 40 }}
            axisLeft={{ legend: 'Value', legendOffset: -50 }}
            enableSlices="x"
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 50,
                itemWidth: 80,
                itemHeight: 20,
                toggleSerie: true
              }
            ]}
          />
        </div>
      </div>
      <div className='analytics_page_tables'>
        <Table actions={<></>} label='Soonest expiring policies' dataSource={[]}
               columns={soonestExpiringPoliciesTableHeaders}/>
      </div>
    </div>
  </Page>
}
export default AnalyticsPage;
