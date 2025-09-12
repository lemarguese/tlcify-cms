import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import type { IRenewal, IRenewalFilter } from "@/types/renewal/main.ts";
import { instance } from "@/api/axios.ts";
import Date from "@/components/Date/Date.tsx";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

export const renewalTableHeaders: ColumnsType = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
    render: (_, record) => record.firstName && record.lastName ? `${record.firstName} ${record.lastName}` : record.corporationName,
  },
  { title: "TLC FHV Number", dataIndex: "tlcFhvNumber", key: "tlcFhvNumber" },
  {
    title: "TLC FHV Exp. Date",
    dataIndex: "tlcFhvExpiration",
    key: "tlcFhvExpiration",
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
  {
    title: "DMV Exp. Date",
    dataIndex: "dmvExpiration",
    key: "dmvExpiration",
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
];

const renewalFilterInitialState: IRenewalFilter = {
  tlcFhvExpiration: undefined,
  dmvExpiration: undefined
}

export const getRenewalsFunction = () => {
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState<IRenewal[]>([]);
  const [renewalsFilters, setRenewalsFilter] = useState<IRenewalFilter>(renewalFilterInitialState)

  const fetchRenewalsOfCustomers = async (params: IRenewalFilter) => {
    const response = await instance.get('/customer/renewals', {
      params
    });
    setRenewals(response.data);
  }

  const changeFilters = (key: keyof IRenewalFilter) => {
    return (value: Dayjs | null) => {
      setRenewalsFilter(prev => ({
        ...prev,
        [key]: value ? value.toDate() : undefined
      }))
    }
  }

  const actions = <div className='renewals_page_actions'>
    <label className='renewals_page_actions_label'>Filters</label>
    <div className='renewals_page_actions_filters'>
      <Date label='TLC FHV Expiration'
            value={renewalsFilters.tlcFhvExpiration ? dayjs(renewalsFilters.tlcFhvExpiration) : null}
            onChange={changeFilters('tlcFhvExpiration')}/>
      <Date label='DMV Expiration'
            value={renewalsFilters.dmvExpiration ? dayjs(renewalsFilters.dmvExpiration) : null}
            onChange={changeFilters('dmvExpiration')}/>
    </div>
  </div>;

  const navigateToCustomerDetails = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  }

  return {
    fetchRenewalsOfCustomers, renewals, renewalsFilters,

    actions, navigateToCustomerDetails
  }
}

