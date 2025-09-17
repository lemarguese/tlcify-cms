import type { ColumnsType } from "antd/es/table";
import { useCallback, useState } from "react";
import type { IRenewal, IRenewalFilter } from "@/types/renewal/main.ts";
import { instance } from "@/api/axios.ts";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

export const renewalTableHeaders: ColumnsType = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
    render: (_, record) => record.firstName && record.lastName ? `${record.firstName} ${record.lastName}` : record.corporationName,
  },
  {
    title: "TLC (FHV) Number", dataIndex: "tlcFhvNumber", key: "tlcFhvNumber", render: (_, record) => {
      return record.tlcFhvNumber ? record.tlcFhvNumber : record.tlcNumber
    }
  },
  {
    title: "TLC (FHV) Exp. Date",
    dataIndex: "tlcFhvExpiration",
    key: "tlcFhvExpiration",
    render: (_, record) => {
      return dayjs(record.tlcFhvExpiration ? record.tlcFhvExpiration : record.tlcExp).format('MM/DD/YYYY')
    }
  },
  {
    title: "Registration Exp. Date",
    dataIndex: "dmvExpiration",
    key: "dmvExpiration",
    render: (_, record) => {
      return record.dmvExpiration ? dayjs(record.dmvExpiration).format('MM/DD/YYYY') : 'Not a customer'
    }
  },
  {
    title: "DDC Exp. Date",
    dataIndex: "defensiveDriverCourseExpiration",
    key: "defensiveDriverCourseExpiration",
    render: (_, record) => {
      const driverDDCExp = record.defensiveDriverCourseExp ? dayjs(record.defensiveDriverCourseExp).format('MM/DD/YYYY') : 'Not provided';
      const customerDDCExp = record.defensiveDriverCourseExpiration ? dayjs(record.defensiveDriverCourseExpiration).format('MM/DD/YYYY') : 'Not provided';

      return driverDDCExp !== 'Not provided' ? driverDDCExp : customerDDCExp;
    }
  },
];

export const getRenewalsFunction = () => {
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState<IRenewal[]>([]);
  const [renewalsFilters, setRenewalsFilter] = useState<IRenewalFilter>()

  const fetchRenewalsOfCustomers = async (params?: IRenewalFilter) => {
    const response = await instance.get('/customer/renewals', {
      params
    });
    setRenewals(response.data);
  }

  const changeQueryDate = useCallback((key: 'dmvExpiration' | 'tlcFhvExpiration' | 'ddcExp') => {
    return (val: any[] | null) => {
      setRenewalsFilter(prev => ({
        ...prev,
        [`${key}From`]: val ? val[0].toDate() : undefined,
        [`${key}To`]: val ? val[1].toDate() : undefined
      }))
    }
  }, []);

  const navigateToCustomerDetails = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const resetFilters = useCallback(() => {
    setRenewalsFilter(prev => {
      if (prev) {
        fetchRenewalsOfCustomers()
        return undefined;
      }
    })
  }, [])

  return {
    fetchRenewalsOfCustomers, renewals, renewalsFilters,

    changeQueryDate, navigateToCustomerDetails, resetFilters
  }
}

