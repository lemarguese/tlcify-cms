import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";
import {
  getTransactionFunctions, transactionsFilterSelectionOptions,
  transactionsReportsTableHeaders,
  transactionsTableHeaders
} from "@/pages/Transactions/utils/transactions.tsx";
import { useNavigate } from "react-router";

import './TransactionsPage.scss';
import { useEffect, useMemo } from "react";
import Selector from "@/components/Selector/Selector.tsx";
import Button from "@/components/Button/Button.tsx";
import Range from "@/components/Range/Range.tsx";
import { getInsuranceFunctions } from "@/pages/Insurance/utils/insurance.tsx";
import { formatCurrency } from "@/utils/payment.ts";
import dayjs from "dayjs";
import { Table as AntTable } from "antd";

const TransactionsPage = () => {
  const navigate = useNavigate();

  const {
    payments,
    fetchAllPayments,
    query,
    resetQuery,
    changeQueryDate,
    changeQuerySelector,
    reportsData,
    grandTotal,
    transactionTableActions,

    transactionsLoading
  } = getTransactionFunctions();
  const { insurances, fetchInsurances } = getInsuranceFunctions();

  useEffect(() => {
    fetchAllPayments();
    fetchInsurances();
  }, []);

  const selectorInsuranceOptions = useMemo(() => insurances.map(i => ({
    label: i.name,
    value: i._id
  })), [insurances]);

  return <Page loading={transactionsLoading} showSearch>
    <div className='transactions_page'>
      <div className='transactions_page_header'>
        <div className='transactions_page_header_filter'>
          <div className='transactions_page_header_filter_container'>
            <div className='transactions_page_header_filter_items'>
              <Selector label='Insurance Carrier' onChange={changeQuerySelector('insuranceCarrier')}
                        value={query?.insuranceCarrier} options={selectorInsuranceOptions}/>
              <Selector label='Payment method' onChange={changeQuerySelector('paymentMethod')}
                        value={query?.paymentMethod}
                        options={transactionsFilterSelectionOptions}/>
            </div>
            <Range label='Report Date Range' value={query ? query.fromDate || query.toDate ? [
              query ? dayjs(query.fromDate) : null,
              query ? dayjs(query.toDate) : null
            ] : null : null} onChange={changeQueryDate} allowClear={false}/>
          </div>
          <div className='transactions_page_header_filter_submit'>
            <Button variant='solid' type='primary' onClick={fetchAllPayments}>Apply filters</Button>
            <Button variant='solid' type='default' onClick={resetQuery}>Reset filters</Button>
          </div>
        </div>
        <div className='transactions_page_header_reports'>
          <Table columns={transactionsReportsTableHeaders} actions={<></>} dataSource={reportsData}
                 label='Reports by payment method' pagination={false} summary={(_) => {
            return <AntTable.Summary.Row>
              <AntTable.Summary.Cell index={1} colSpan={1}>GRAND TOTAL: </AntTable.Summary.Cell>
              <AntTable.Summary.Cell index={2}
                                     colSpan={1}>{formatCurrency(grandTotal.totalPremiumPrice)}</AntTable.Summary.Cell>
              <AntTable.Summary.Cell index={3}
                                     colSpan={1}>{formatCurrency(grandTotal.totalPremiumFee)}</AntTable.Summary.Cell>
              <AntTable.Summary.Cell index={3}
                                     colSpan={1}>{formatCurrency(grandTotal.totalPrice)}</AntTable.Summary.Cell>
            </AntTable.Summary.Row>
          }}/>
        </div>
      </div>
      <Table columns={transactionsTableHeaders} actions={transactionTableActions} onRow={(item) => {
        return {
          onClick: () => {
            if (!item.isDeleted) navigate(`/payments/${item._id}`)
          },
        }
      }} dataSource={payments} rowKey='_id' label='Transactions'/>
    </div>
  </Page>
};

export default TransactionsPage;
