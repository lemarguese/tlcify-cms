import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ICustomerCreate } from "@/types/customer/main.ts";
import dayjs from "dayjs";

export const customerTableHeaders: ColumnsType = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName)
  },
  { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
  // { title: "Email", dataIndex: "email", key: "email" },
  // { title: "Date of Birth", dataIndex: "dob", key: "dob", sorter: (a, b) => new Date(a.dob) - new Date(b.dob) },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "TCL Number", dataIndex: "tlcNumber", key: "tlcNumber" },
  {
    title: "TLC Exp.",
    dataIndex: "tlcExp",
    key: "tlcExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.tlcExp).valueOf() - new Date(b.tlcExp).valueOf()
  },
  { title: "DL Number", dataIndex: "driverLicenseNumber", key: "driverLicenseNumber" },
  {
    title: "DL Exp.",
    dataIndex: "driverLicenseExp",
    key: "driverLicenseExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.dlExp).valueOf() - new Date(b.dlExp).valueOf()
  },
  // { title: "Last 5 SSN", dataIndex: "last5SSN", key: "last5SSN" },
  {
    title: "DDC Exp.",
    dataIndex: "defensiveDriverCourseExp",
    key: "defensiveDriverCourseExp",
    render: (value) => dayjs(value).format('MM/DD/YYYY'),
    sorter: (a, b) => new Date(a.ddcExp).valueOf() - new Date(b.ddcExp).valueOf()
  },
  {
    title: "Status", dataIndex: "status", key: "status", render: () => <>
      <Tag color={'green'}>Active</Tag>
    </>,
  }
];

export const newCustomerFormInitialState: ICustomerCreate = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  dateOfBirth: new Date(Date.now()),
  address: '',
  tlcNumber: '',
  tlcExp: new Date(Date.now()),
  driverLicenseNumber: '',
  driverLicenseExp: new Date(Date.now()),
  lastSSN: '',
  defensiveDriverCourseExp: new Date(Date.now()),
}
