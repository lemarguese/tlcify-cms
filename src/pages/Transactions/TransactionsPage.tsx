import type { FC } from "react";
import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";
import { transactionsTableHeaders } from "@/pages/Transactions/utils/transactions.tsx";
import { useNavigate } from "react-router";

import './TransactionsPage.scss';

interface TransactionsPageProps {

}

const TransactionsPage: FC<TransactionsPageProps> = ({}) => {
  const navigate = useNavigate();

  return <Page showSearch>
    <div className='transactions_page_container'>
      <Table columns={transactionsTableHeaders} actions={<></>} onRow={(item) => {
        return {
          onClick: () => {
            navigate(`${item._id}`)
          },
        }
      }} dataSource={[]} rowKey='_id' label='Transactions'/>
    </div>
  </Page>
};

export default TransactionsPage;
