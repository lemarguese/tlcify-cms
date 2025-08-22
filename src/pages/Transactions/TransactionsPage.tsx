import type { FC } from "react";
import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";
import { getTransactionFunctions, transactionsTableHeaders } from "@/pages/Transactions/utils/transactions.tsx";
import { useNavigate } from "react-router";

import './TransactionsPage.scss';
import { useEffect } from "react";

interface TransactionsPageProps {

}

const TransactionsPage: FC<TransactionsPageProps> = ({}) => {
  const navigate = useNavigate();

  const { payments, fetchAllPayments } = getTransactionFunctions();

  useEffect(() => {
    fetchAllPayments();
  }, []);

  return <Page title='Transactions' showSearch>
    <div className='transactions_page_container'>
      <Table columns={transactionsTableHeaders} actions={<></>} onRow={(item) => {
        return {
          onClick: () => {
            navigate(`${item._id}`)
          },
        }
      }} dataSource={payments} rowKey='_id' label='Transactions'/>
    </div>
  </Page>
};

export default TransactionsPage;
