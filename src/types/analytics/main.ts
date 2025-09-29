import type { LineSeries } from "@nivo/line";

interface IAnalyticsKpiStatistics {
  currentMonth: number;
  lastMonth: number;
}

export interface IAnalyticsKpi {
  totalRevenue: IAnalyticsKpiStatistics,
  totalCommissionFee: IAnalyticsKpiStatistics,
  activePoliciesCount: IAnalyticsKpiStatistics,
  expiringPoliciesCount: IAnalyticsKpiStatistics,
  totalFees: IAnalyticsKpiStatistics
}

export interface IAnalyticsRevenueByFrequency extends LineSeries {

}

export type IAnalyticsFrequency = 'daily' | 'monthly' | 'yearly';
