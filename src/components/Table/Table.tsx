import type { FC, ReactNode } from 'react';
import { Table as AntTable } from "antd";
import type { TableProps } from "antd";

import './Table.scss';

interface CustomTableProps extends TableProps {
  label: string;
  actions: ReactNode;
}

const Table: FC<CustomTableProps> = ({ actions, label, ...tableProps }) => {
  return <div className='table'>
    <div className='table_header'>
      <h3>{label}</h3>
      {actions}
    </div>
    <AntTable {...tableProps} className='table_antClass'/>
  </div>
};

export default Table;
