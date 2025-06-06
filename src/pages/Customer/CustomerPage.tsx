import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import Table from "../../components/Table/Table.tsx";

const CustomerPage = () => {
  return <div>
    <Sidebar />
    <div>
      <Table heads={['hey', 'heyllo']} />
    </div>
  </div>
}

export default CustomerPage;
