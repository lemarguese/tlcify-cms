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

const TransactionsPage = ({}) => {
  const navigate = useNavigate();

  const {
    payments,
    fetchAllPayments,
    query,
    resetQuery,
    changeQueryDate,
    changeQuerySelector,
    reportsData,
    grandTotal
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

  return <Page showSearch>
    <div className='transactions_page'>
      <div className='transactions_page_header'>
        <div className='transactions_page_header_filter'>
          <div>
            <div className='transactions_page_header_filter_items'>
              <Selector label='Insurance Carrier' onChange={changeQuerySelector('insuranceCarrier')}
                        value={query?.insuranceCarrier} options={selectorInsuranceOptions}/>
              <Selector label='Payment method' onChange={changeQuerySelector('paymentMethod')}
                        value={query?.paymentMethod}
                        options={transactionsFilterSelectionOptions}/>
            </div>
            <Range label='Report Date Range' onChange={changeQueryDate}/>
          </div>
          <div className='transactions_page_header_filter_submit'>
            <Button variant='solid' type='primary' onClick={fetchAllPayments}>Apply filters</Button>
            <Button variant='solid' type='default' onClick={resetQuery}>Reset filters</Button>
          </div>
        </div>
        <div className='transactions_page_header_reports'>
          <Table columns={transactionsReportsTableHeaders} actions={<></>} dataSource={reportsData}
                 label='Reports by payment method' pagination={false} footer={
            (data) => <div className='transactions_page_header_reports_footer'>
              <label>GRAND TOTAL: </label>
              <div className='transactions_page_header_reports_footer_list'>
                <p>{formatCurrency(grandTotal.totalPrice)}</p>
                <p>{formatCurrency(grandTotal.totalPremiumFee)}</p>
                <p>{formatCurrency(grandTotal.totalPremiumPrice)}</p>
              </div>
            </div>
          }/>
        </div>
      </div>
      <Table columns={transactionsTableHeaders} actions={<></>} onRow={(item) => {
        return {
          onClick: () => {
            navigate(`/invoice/${item._id}`)
          },
        }
      }} dataSource={payments} rowKey='_id' label='Transactions'/>
    </div>
  </Page>
};

export default TransactionsPage;
