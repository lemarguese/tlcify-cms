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
  { title: "TLC Number", dataIndex: "tlcNumber", key: "tlcNumber" },
  {
    title: "TLC Exp. Date",
    dataIndex: "tlcExp",
    key: "tlcExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
  {
    title: "DDC Exp. Date",
    dataIndex: "defensiveDriverCourseExp",
    key: "defensiveDriverCourseExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY')
  },
];

const renewalFilterInitialState: IRenewalFilter = {
  tlcExp: undefined,
  defensiveDriverCourseExp: undefined
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
      <Date label='TLC Expiration' value={renewalsFilters.tlcExp ? dayjs(renewalsFilters.tlcExp) : null}
            onChange={changeFilters('tlcExp')}/>
      <Date label='DDC Expiration'
            value={renewalsFilters.defensiveDriverCourseExp ? dayjs(renewalsFilters.defensiveDriverCourseExp) : null}
            onChange={changeFilters('defensiveDriverCourseExp')}/>
    </div>
  </div>

  return {
    fetchRenewalsOfCustomers, renewals, renewalsFilters,

    actions
  }
}

