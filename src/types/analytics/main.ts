import type { LineSeries } from "@nivo/line/dist/types/types";

export interface IAnalyticsKpi {
  totalRevenue: number,
  totalCommissionFee: number,
  activePoliciesCount: number,
  expiringPoliciesCount: number,
  totalFees: number
}

export interface IAnalyticsRevenueByFrequency extends LineSeries {

}

export type IAnalyticsFrequency = 'daily' | 'monthly' | 'yearly';
