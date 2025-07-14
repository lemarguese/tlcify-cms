import type { FC } from "react";
import Page from "@/layout/Page/Page.tsx";

import './TransactionDetailsPage.scss';
import Button from "@/components/Button/Button.tsx";

import TransactionImage from '@/assets/images/transaction_mock_image.jpg';
import Table from "@/components/Table/Table.tsx";
import { transactionsPartialInvoiceHeaders } from "@/pages/Transactions/utils/transactions.tsx";
import TransactionDetailTotalTableFooter
  from "@/pages/TransactionsDetails/components/TotalTableFooter/TotalTableFooter.tsx";

import { ClockCircleOutlined } from '@ant-design/icons'
import TransactionsDetailsPaymentStepper
  from "@/pages/TransactionsDetails/components/PaymentStepper/PaymentStepper.tsx";
import { useNavigate } from "react-router";

interface TransactionsDetailsPageProps {

}

const mockData = [
  {
    transactionId: '#2020-05-0001',
    productName: "Wireless Mouse",
    productQuantity: 2,
    productPrice: 25.99,
    vat: "8%",
    amount: 51.98,
    fullAmount: 56.14,
  },
  {
    transactionId: '#2020-05-0002',
    productName: "Mechanical Keyboard",
    productQuantity: 1,
    productPrice: 89.99,
    vat: "8%",
    amount: 89.99,
    fullAmount: 97.19,
  },
  {
    transactionId: '#2020-05-0003',
    productName: "HD Monitor",
    productQuantity: 3,
    productPrice: 149.5,
    vat: "8%",
    amount: 448.5,
    fullAmount: 484.38,
  },
  {
    transactionId: '#2020-05-0004',
    productName: "Laptop Stand",
    productQuantity: 5,
    productPrice: 20,
    vat: "8%",
    amount: 100,
    fullAmount: 108,
  },
  {
    transactionId: '#2020-05-0005',
    productName: "USB-C Hub",
    productQuantity: 4,
    productPrice: 35,
    vat: "8%",
    amount: 140,
    fullAmount: 151.2,
  },
];

const TransactionsDetailsPage: FC<TransactionsDetailsPageProps> = ({}) => {
  const navigate = useNavigate();

  return <Page showSearch={false} back={() => navigate(-1)}>
    <div className='transactions_details_page_container'>
      <div className='transactions_details_page_header'>
        <div className='transactions_details_page_header_description'>
          <h4 className='transactions_details_page_header_description_title'>Invoice #2020-05-0001</h4>
          <p className='transactions_details_page_header_description_paid_date'>Paid on June 27, 2023</p>
        </div>
        <div className='transactions_details_page_header_actions'>
          <Button>More Options</Button>
          <Button>Record a payment</Button>
        </div>
      </div>
      <div className='transactions_details_page_content'>
        <div className='transactions_details_page_body'>
          <div className='transactions_details_page_body_top'>
            <div className='transactions_details_page_body_top_container'>
              <img src={TransactionImage} alt='transaction_details_image'
                   className='transactions_details_page_body_top_image'/>
              <div className='transactions_details_page_body_top_content'>
                <div className='transactions_details_page_body_top_content_head'>
                  <h6>Sisyphus</h6>
                </div>
                <div className='transactions_details_page_body_top_content_body'>
                  <p>John Brandon</p>
                  <p>789/1 Sector-2c, 38200 Gandhinagar, France</p>
                  <p>848172194 | contact@betao.se</p>
                  <p>SIRET: 362 521 879 00034</p>
                  <p>VAT: 842-484021</p>
                </div>
              </div>
            </div>
            <div className='transactions_details_page_body_top_sum'>
              <div className='transactions_details_page_body_top_sum_chip'>
                <p>#2020-05-0001</p>
              </div>
              <div>
                <p>Total Amount</p>
                <p>€3,030.00</p>
              </div>
            </div>
          </div>
          <div className='transactions_details_page_body_footer'>
            <Table rowKey='transactionId' footer={TransactionDetailTotalTableFooter} actions={<></>}
                   columns={transactionsPartialInvoiceHeaders} dataSource={mockData}/>
          </div>
        </div>
        <div className='transactions_details_page_footer'>
          <div className='transactions_details_page_footer_outdue'>
            <ClockCircleOutlined className='transactions_details_page_footer_outdue_text'/>
            <p className='transactions_details_page_footer_outdue_text'>Late</p>
          </div>
          <div className='transactions_details_page_footer_status'>
            <p>Invoice not yet sent!</p>
            <Button className='transactions_details_page_footer_status_send'>Send Invoice</Button>
          </div>
          <div className='transactions_details_page_footer_steps'>
            <div className='transactions_details_page_footer_steps_header'>
              <p>Summary</p>
            </div>
            <div className='transactions_details_page_footer_steps_total'>
              <p>Total</p>
              <p>€3,030 Incl. VAT</p>
            </div>
            <div className='transactions_details_page_footer_steps_list'>
              <TransactionsDetailsPaymentStepper hasNext />
              <TransactionsDetailsPaymentStepper hasNext />
              <TransactionsDetailsPaymentStepper />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
}

export default TransactionsDetailsPage;
