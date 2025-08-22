import { useState } from "react";
import type { IAnalyticsFrequency, IAnalyticsKpi, IAnalyticsRevenueByFrequency } from "@/types/analytics/main.ts";
import { instance } from "@/api/axios.ts";

export const soonestExpiringPoliciesTableHeaders = [
  {
    title: 'Customer Name',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Policy Number',
    dataIndex: 'policyNumber',
    key: 'policyNumber',
  },
  {
    title: 'TLC Expiration',
    dataIndex: 'tlcExp',
    key: 'tlcExp',
    render: (date) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Policy Expiration',
    dataIndex: 'policyExpirationDate',
    key: 'policyExpirationDate',
    render: (date) => new Date(date).toLocaleDateString(),
  },
];

const analyticsKpisInitialState: IAnalyticsKpi = {
  totalFees: 0,
  activePoliciesCount: 0,
  expiringPoliciesCount: 0,
  totalRevenue: 0,
  totalCommissionFee: 0
}

export const getAnalyticsFunctions = () => {
  const [kpis, setKpis] = useState<IAnalyticsKpi>(analyticsKpisInitialState);
  const [revenueByFrequency, setRevenueByFrequency] = useState<IAnalyticsRevenueByFrequency[]>([]);
  const [frequency, setFrequency] = useState<IAnalyticsFrequency>('daily');

  const fetchKpis = async () => {
    const response = await instance.get('/analytics/kpis');
    setKpis(response.data)
  }

  const fetchRevenueByFrequency = async (frequency: IAnalyticsFrequency) => {
    const response = await instance.get('/analytics/revenue', {
      params: {
        frequency
      }
    });
    setRevenueByFrequency([response.data]);
  }

  return {
    kpis, fetchKpis,
    revenueByFrequency, fetchRevenueByFrequency,
    frequency, setFrequency
  }
}
