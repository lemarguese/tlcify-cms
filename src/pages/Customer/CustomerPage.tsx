import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import Table from "../../components/Table/Table.tsx";
import Page from "../../layout/Page/Page.tsx";

import './CustomerPage.scss';

const heads = [
  { title: "First Name", dataIndex: "firstName", key: "firstName", sorter: (a, b) => a.firstName.localeCompare(b.firstName) },
  { title: "Last Name", dataIndex: "lastName", key: "lastName", sorter: (a, b) => a.lastName.localeCompare(b.lastName) },
  // { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
  // { title: "Email", dataIndex: "email", key: "email" },
  // { title: "Date of Birth", dataIndex: "dob", key: "dob", sorter: (a, b) => new Date(a.dob) - new Date(b.dob) },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "TCL Number", dataIndex: "tclNumber", key: "tclNumber" },
  { title: "TLC Exp.", dataIndex: "tlcExp", key: "tlcExp", sorter: (a, b) => new Date(a.tlcExp) - new Date(b.tlcExp) },
  { title: "DL Number", dataIndex: "dlNumber", key: "dlNumber" },
  { title: "DL Exp.", dataIndex: "dlExp", key: "dlExp", sorter: (a, b) => new Date(a.dlExp) - new Date(b.dlExp) },
  // { title: "Last 5 SSN", dataIndex: "last5SSN", key: "last5SSN" },
  { title: "DDC Exp.", dataIndex: "ddcExp", key: "ddcExp", sorter: (a, b) => new Date(a.ddcExp) - new Date(b.ddcExp) }
];

const data = [
  {
    key: "1",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, New York, NY",
    tclNumber: "TCL12345",
    tlcExp: "2026-05-15",
    dlNumber: "DL987654321",
    dlExp: "2027-03-01",
    ddcExp: "2025-11-20"
  },
  {
    key: "2",
    firstName: "Maria",
    lastName: "Gonzalez",
    address: "456 Elm Ave, Bronx, NY",
    tclNumber: "TCL67890",
    tlcExp: "2025-09-30",
    dlNumber: "DL123456789",
    dlExp: "2026-01-10",
    ddcExp: "2026-02-18"
  },
  {
    key: "3",
    firstName: "David",
    lastName: "Kim",
    address: "789 Broadway, Brooklyn, NY",
    tclNumber: "",
    tlcExp: "",
    dlNumber: "DL555443322",
    dlExp: "2028-08-25",
    ddcExp: ""
  },
  {
    key: "4",
    firstName: "Amina",
    lastName: "Hassan",
    address: "321 Ocean Pkwy, Queens, NY",
    tclNumber: "TCL54321",
    tlcExp: "2024-12-05",
    dlNumber: "DL999112233",
    dlExp: "2025-06-30",
    ddcExp: "2025-07-15"
  },
  {
    key: "5",
    firstName: "Liam",
    lastName: "Patel",
    address: "654 Park Ln, Staten Island, NY",
    tclNumber: "",
    tlcExp: "",
    dlNumber: "",
    dlExp: "",
    ddcExp: ""
  }
];



const CustomerPage = () => {
  return <Page>
    <Sidebar/>
    <div className='customer_page'>
      <Table heads={heads} data={data}/>
    </div>
  </Page>
}

export default CustomerPage;
