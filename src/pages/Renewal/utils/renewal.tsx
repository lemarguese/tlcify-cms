import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import type { IRenewal, IRenewalFilter } from "@/types/renewal/main.ts";
import { instance } from "@/api/axios.ts";
import Date from "@/components/Date/Date.tsx";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export const renewalTableHeaders: ColumnsType = [
  { title: "First Name", dataIndex: "firstName", key: "firstName" },
  { title: "Last Name", dataIndex: "lastName", key: "lastName" },
  { title: "TLC Number", dataIndex: "tlcFhvNumber", key: "tlcFhvNumber" },
  {
    title: "TLC Exp. Date",
    dataIndex: "tlcFhvExpiration",
    key: "tlcFhvExpiration",
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
  {
    title: "DDC Exp. Date",
    dataIndex: "defensiveDriverCourseExpiration",
    key: "defensiveDriverCourseExpiration",
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
];

const renewalFilterInitialState: IRenewalFilter = {
  tlcFhvExpiration: undefined,
  defensiveDriverCourseExpiration: undefined
}

export const getRenewalsFunction = () => {
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
      <Date label='TLC Expiration' value={renewalsFilters.tlcFhvExpiration ? dayjs(renewalsFilters.tlcFhvExpiration) : null}
            onChange={changeFilters('tlcFhvExpiration')}/>
      <Date label='DDC Expiration'
            value={renewalsFilters.defensiveDriverCourseExpiration ? dayjs(renewalsFilters.defensiveDriverCourseExpiration) : null}
            onChange={changeFilters('defensiveDriverCourseExpiration')}/>
    </div>
  </div>

  return {
    fetchRenewalsOfCustomers, renewals, renewalsFilters,

    actions
  }
}

