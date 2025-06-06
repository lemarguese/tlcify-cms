import { FC } from 'react';
import { Table as AntTable } from "antd";
import './Table.scss';

interface TableProps {
  heads: { title: string; dataIndex: string; key: string }[];
  //todo any remove
  data: any[];
}

const Table: FC<TableProps> = ({ heads, data }) => {
  return <div className='table'>
    <h3>Order List</h3>
    <AntTable columns={heads} dataSource={data} className='table_antClass' />
  </div>
};

export default Table;
