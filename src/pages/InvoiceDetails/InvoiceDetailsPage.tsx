import Page from "@/layout/Page/Page.tsx";

import './InvoiceDetailsPage.scss';
import Button from "@/components/Button/Button.tsx";

import TransactionImage from '@/assets/images/transaction_mock_image.jpg';
import Table from "@/components/Table/Table.tsx";
import TransactionDetailTotalTableFooter
  from "@/pages/InvoiceDetails/components/TotalTableFooter/TotalTableFooter.tsx";

import { SendOutlined } from '@ant-design/icons'
import { useParams } from "react-router";
import {
  getInvoiceDetailFunctions, invoiceDetailTableHeaders,
} from "@/pages/InvoiceDetails/utils/invoice_details.tsx";
import { useEffect } from "react";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { formatCustomerName } from "@/utils/customer.ts";

dayjs.extend(advancedFormat);

const InvoiceDetailsPage = () => {
  const { invoiceId } = useParams();

  const {
    invoiceById,
    fetchInvoiceById,
    totalDueAmount,
    totalFeesAmount,
    totalPrice,
    sendInvoiceThroughEmail
  } = getInvoiceDetailFunctions(invoiceId);

  useEffect(() => {
    fetchInvoiceById();
  }, [])

  return <Page showSearch={false}>
    <div className='invoice_details_page_container'>
      <div className='invoice_details_page_header'>
        <div className='invoice_details_page_header_description'>
          <h4 className='invoice_details_page_header_description_title'>Invoice #{invoiceById.invoiceNumber}</h4>
          {invoiceById.paidAt ? <p className='invoice_details_page_header_description_paid_date'>Paid
            on {dayjs(invoiceById.paidAt).format('Do MMMM, YYYY')}</p> : undefined}
        </div>
        <div className='invoice_details_page_header_actions'>
          <Button>More Options</Button>
          <Button>Record a payment</Button>
        </div>
      </div>
      <div className='invoice_details_page_content'>
        <div className='invoice_details_page_body'>
          <div className='invoice_details_page_body_top'>
            <div className='invoice_details_page_body_top_container'>
              <img src={TransactionImage} alt='transaction_details_image'
                   className='invoice_details_page_body_top_image'/>
              <div className='invoice_details_page_body_top_content'>
                <div className='invoice_details_page_body_top_content_head'>
                  {/*<h6>Sisyphus</h6>*/}
                </div>
                <div className='invoice_details_page_body_top_content_body'>
                  <p>{formatCustomerName(invoiceById.customer)}</p>
                  <p>{invoiceById.customer.address}</p>
                  <p>{invoiceById.customer.phoneNumber} | {invoiceById.customer.email}</p>
                  {/*<p>SIRET: 362 521 879 00034</p>*/}
                  {/*<p>VAT: 842-484021</p>*/}
                </div>
              </div>
            </div>
            <div className='invoice_details_page_body_top_sum'>
              <div className='invoice_details_page_body_top_sum_chip'>
                <p>#{invoiceById.invoiceNumber}</p>
              </div>
              <div>
                <p>Total Amount</p>
                <p>{totalPrice}</p>
              </div>
            </div>
          </div>
          <div className='invoice_details_page_body_footer'>
            <Table rowKey='transactionId'
                   footer={() => <TransactionDetailTotalTableFooter totalAmount={totalDueAmount}
                                                                    totalFees={totalFeesAmount}
                                                                    totalPrice={totalPrice}/>}
                   actions={<></>}
                   columns={invoiceDetailTableHeaders} dataSource={invoiceById.policies}/>
          </div>
        </div>
        <div className='invoice_details_page_footer'>
          {/*<div className='invoice_details_page_footer_outdue'>*/}
          {/*  <ClockCircleOutlined className='invoice_details_page_footer_outdue_text'/>*/}
          {/*  <p className='invoice_details_page_footer_outdue_text'>Late</p>*/}
          {/*</div>*/}
          <div className='invoice_details_page_footer_status'>
            {invoiceById.emailSent ? <p>Invoice was sent to email {invoiceById.customer.email}</p> :
              <>
                <p>Invoice not yet sent!</p>
                <Button className='invoice_details_page_footer_status_send' icon={<SendOutlined/>}
                        onClick={sendInvoiceThroughEmail}>Send Invoice
                </Button>
              </>
            }
          </div>
          {/*<div className='invoice_details_page_footer_steps'>*/}
          {/*  <div className='invoice_details_page_footer_steps_header'>*/}
          {/*    <p>Summary</p>*/}
          {/*  </div>*/}
          {/*  <div className='invoice_details_page_footer_steps_total'>*/}
          {/*    <p>Total</p>*/}
          {/*    <p>{totalPrice}</p>*/}
          {/*  </div>*/}
          {/*  <div className='invoice_details_page_footer_steps_list'>*/}
          {/*    <TransactionsDetailsPaymentStepper hasNext/>*/}
          {/*    <TransactionsDetailsPaymentStepper hasNext/>*/}
          {/*    <TransactionsDetailsPaymentStepper/>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  </Page>
}

export default InvoiceDetailsPage;
