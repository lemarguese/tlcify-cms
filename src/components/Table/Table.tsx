import type { FC, JSX } from "react";

interface TableProps {
  heads: string[];

}

const Table: FC<TableProps> = ({ heads }): JSX.Element => {
  return <div>
    <h3>Order List</h3>
    <table>
      <thead>
      { heads.map(head => <th key={`table-head-${head}`}>{head}</th>) }
      </thead>
      <tbody>

      </tbody>
    </table>
  </div>
};

export default Table;
