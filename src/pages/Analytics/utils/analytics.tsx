import { useCallback, useState } from "react";
import type { IAnalyticsFrequency, IAnalyticsKpi, IAnalyticsRevenueByFrequency } from "@/types/analytics/main.ts";
import { instance } from "@/api/axios.ts";
import dayjs from "dayjs";
import type { IPolicy } from "@/types/policy/main.ts";
import type { RadioChangeEvent } from "antd";

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
    render: (date: Date) => dayjs(date).format('MM/DD/YYYY'),
  },
  {
    title: 'Policy Expiration',
    dataIndex: 'expirationDate',
    key: 'expirationDate',
    render: (date: Date) => dayjs(date).format('MM/DD/YYYY'),
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
  const [expiringPolicies, setExpiringPolicies] = useState<IPolicy[]>([]);

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

  const fetchExpiringPolicies = async () => {
    const response = await instance.get('/analytics/expiring-policies');
    setExpiringPolicies(response.data);
  }

  const changeFrequency = useCallback((e: RadioChangeEvent) => {
    setFrequency(e.target.value)
  }, [])

  return {
    kpis, fetchKpis,
    revenueByFrequency, fetchRevenueByFrequency,
    frequency, changeFrequency,
    expiringPolicies, fetchExpiringPolicies
  }
}

export const frequencyRadioOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]
