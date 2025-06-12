import { FC, ReactNode } from 'react';
import { Table as AntTable } from "antd";
import './Table.scss';

interface TableProps {
  title: string;
  actions: ReactNode;
  heads: { title: string; dataIndex: string; key: string }[];
  //todo any remove
  data: any[];
}

const Table: FC<TableProps> = ({ heads, data, actions, title }) => {
  return <div className='table'>
    <div className='table_header'>
      <h3>{title}</h3>
      {actions}
    </div>
    <AntTable columns={heads} dataSource={data} className='table_antClass'/>
  </div>
};

export default Table;
