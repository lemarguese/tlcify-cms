import './PaymentSuccessfulPage.scss';
import { getInvoiceDetailFunctions } from "@/pages/InvoiceDetails/utils/invoice_details.tsx";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect } from "react";
import { formatCustomerName } from "@/utils/customer.ts";
import Table from "@/components/Table/Table.tsx";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/payment.ts";
import Button from "@/components/Button/Button.tsx";

const PaymentSuccessfulPage = () => {
  const { invoiceId } = useParams();

  const paymentSuccessfulTableHeaders: ColumnsType = [
    { dataIndex: ['policy', 'policyNumber'], key: 'policy', title: 'Policy Number' },
    { dataIndex: 'insuranceCarrierName', key: 'insuranceCarrierName', title: 'Insurance Carrier' },
    { dataIndex: 'amount', key: 'amount', title: 'Paid amount', render: (val) => formatCurrency(+val) },
    { dataIndex: 'dueDate', key: 'dueDate', title: 'Due date', render: (val) => dayjs(val).format('MM/DD/YYYY') },
  ];

  const navigate = useNavigate();

  const navigateHome = useCallback(() => {
    navigate('/')
  }, []);

  const { invoiceById, fetchInvoiceById } = getInvoiceDetailFunctions(invoiceId);

  useEffect(() => {
    fetchInvoiceById()
  }, []);

  return <div className='payment_successful_page'>
    <div className='payment_successful_page_left'>
      <div className='payment_successful_page_left_container'>
        <div className='payment_successful_page_left_icon'></div>
        <div className='payment_successful_page_left_content'>
          <h4 className='payment_successful_page_left_content_name'>TLCify.com</h4>
          <p className='payment_successful_page_left_content_description'>Stay Ahead. Stay Legal. Stay TLCified.</p>
        </div>
      </div>
      <div className='payment_successful_page_left_footer'>
        <p className='payment_successful_page_left_footer_text'>© 2025. TLCify.com. All Rights Reserved.</p>
      </div>
    </div>
    <div className='payment_successful_page_right'>
      <div className='payment_successful_page_right_container'>
        <h1 className='payment_successful_page_right_title'>Payment Successful.</h1>
        <div className='payment_successful_page_right_personal'>
          <label className='payment_successful_page_right_personal_title'>Order details</label>
          <div className='payment_successful_page_right_personal_complete'>
            <div className='payment_successful_page_right_personal_complete_top'>
              <div className='payment_successful_page_right_personal_complete_top_item'>
                <label className='payment_successful_page_right_personal_complete_top_item_label'>Invoice Number</label>
                <p
                  className='payment_successful_page_right_personal_complete_top_item_content'>{invoiceById.invoiceNumber}</p>
              </div>
              <div className='payment_successful_page_right_personal_complete_top_item'>
                <label className='payment_successful_page_right_personal_complete_top_item_label'>Customer Name</label>
                <p
                  className='payment_successful_page_right_personal_complete_top_item_content'>{formatCustomerName(invoiceById.customer)}</p>
              </div>
            </div>
            <Table actions={<></>} pagination={false} columns={paymentSuccessfulTableHeaders}
                   dataSource={invoiceById.policies}/>
            <Button variant='solid' type='primary' color='geekblue' className='payment_successful_page_right_button'
                    onClick={navigateHome}>Go home</Button>
          </div>
        </div>
      </div>
      <div className='payment_successful_page_right_footer'>
        <p className='payment_successful_page_right_footer_text'>Instructions</p>
        <p className='payment_successful_page_right_footer_text'>License</p>
        <p className='payment_successful_page_right_footer_text'>Terms of Use</p>
        <p className='payment_successful_page_right_footer_text'>Privacy</p>
      </div>
    </div>
  </div>
}

export default PaymentSuccessfulPage;
