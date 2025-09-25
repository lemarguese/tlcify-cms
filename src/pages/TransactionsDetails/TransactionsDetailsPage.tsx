import './TransactionsDetailsPage.scss';

import Page from "@/layout/Page/Page.tsx";
import { getTransactionDetailsFunctions } from "@/pages/TransactionsDetails/utils/transactions_details.tsx";
import { useParams } from "react-router";
import { useEffect } from "react";

const TransactionsDetailsPage = () => {
  const { paymentId } = useParams();

  const { fetchTransactionById, cellInformation } = getTransactionDetailsFunctions(paymentId);

  useEffect(() => {
    fetchTransactionById();
  }, []);

  return <Page showSearch={false}>
    <div className='transactions_details_page'>
      <div className='transactions_details_page_container'>
        <div className='transactions_details_page_label'>
          <label className='transactions_details_page_label_text'>PAYMENT INFORMATION</label>
        </div>
        <div className='transactions_details_page_accords'>
          <div className='transactions_details_page_accords_title'>
            <label className='transactions_details_page_accords_title_text'>RECEIPT TO</label>
            <p
              className='transactions_details_page_accords_title_name'>{cellInformation.customerFullName}</p>
          </div>
          <div className='transactions_details_page_accords_invoice'>
            <label className='transactions_details_page_accords_invoice_title'>TRANSACTION NUMBER</label>
            <p className='transactions_details_page_accords_invoice_number'>{cellInformation.transactionNumber}</p>
          </div>
        </div>
        <div className='transactions_details_page_date'>
          <div className='transactions_details_page_date_received'>
            <label className='transactions_details_page_date_title'>DATE RECEIVED</label>
            <p
              className='transactions_details_page_date_value'>{cellInformation.transactionReceivedDate}</p>
          </div>
          <div className='transactions_details_page_date_issued'>
            <label className='transactions_details_page_date_title'>DATE OF DUE</label>
            <p
              className='transactions_details_page_date_value'>{cellInformation.transactionDueDate}</p>
          </div>
        </div>
        <div className='transactions_details_page_description'>
          <label className='transactions_details_page_description_title'>POLICY DESCRIPTION</label>
          <div className='transactions_details_page_description_list'>
            <div className='transactions_details_page_description_list_item'>
              <label className='transactions_details_page_description_list_item_label'>POLICY NUMBER</label>
              <p className='transactions_details_page_description_list_item_text'>{cellInformation.policyNumber}</p>
            </div>
            <div className='transactions_details_page_description_list_item'>
              <label className='transactions_details_page_description_list_item_label'>EFFECTIVE DATE</label>
              <p
                className='transactions_details_page_description_list_item_text'>{cellInformation.policyEffectiveDate}</p>
            </div>
            <div className='transactions_details_page_description_list_item'>
              <label className='transactions_details_page_description_list_item_label'>EXPIRATION DATE</label>
              <p
                className='transactions_details_page_description_list_item_text'>{cellInformation.policyExpirationDate}</p>
            </div>
          </div>
        </div>
        <div className='transactions_details_page_paid transactions_details_page_paid_by'>
          <label className='transactions_details_page_paid_title'>PAID BY</label>
          <div className='transactions_details_page_paid_content'>
            <div className='transactions_details_page_paid_content_names'>
              <h4 className='transactions_details_page_paid_content_names_title'>FULL NAME</h4>
              <p className='transactions_details_page_paid_content_names_value'>{cellInformation.customerFullName}</p>
            </div>
            <div className='transactions_details_page_paid_content_address'>
              <p className='transactions_details_page_paid_content_address_text'>{cellInformation.customerAddress}</p>
            </div>
            <div className='transactions_details_page_paid_content_email'>
              <p className='transactions_details_page_paid_content_email_text'>{cellInformation.customerEmail}</p>
            </div>
          </div>
          <div className='transactions_details_page_paid_footer'>
            <div className='transactions_details_page_paid_footer_issuer'>
              <label className='transactions_details_page_paid_footer_issuer_label'>ISSUER</label>
              <label className='transactions_details_page_paid_footer_issuer_text'>insurance@tlcify.com</label>
            </div>
          </div>
        </div>
        <div className='transactions_details_page_issuer'>
          <div className='transactions_details_page_issuer_item'>
            <label className='transactions_details_page_issuer_item_label'>ISSUER</label>
            <p className='transactions_details_page_issuer_item_text'>insurance@tlcify.com</p>
          </div>
          <div className='transactions_details_page_issuer_item'>
            <label className='transactions_details_page_issuer_item_label'>INSURANCE CARRIER</label>
            <p className='transactions_details_page_issuer_item_text'>{cellInformation.insuranceCarrierName}</p>
          </div>
        </div>
        <div className='transactions_details_page_method'>
          <label className='transactions_details_page_method_label'>PAYMENT METHOD USED</label>
          <div className='transactions_details_page_method_content'>
            <div className='transactions_details_page_method_content_item'>
              <label>Physical Cheque</label>
              <p>Bank:
                Bank name</p>
              <p>Account Number:
                0123456789</p>
              <p>Cheque No:
                01223334444</p>
              <p>Amount:
                ₹00,000
                &
                ₹00,000</p>
            </div>
            <div className='transactions_details_page_method_content_item'>
              <label>Paypal</label>
              <p>Username:
                username</p>
              <p>Transaction ID:
                355019091789</p>
              <p>Amount:
                ₹00,000</p>
            </div>
          </div>
        </div>
        <div className='transactions_details_page_summary'>
          <div className='transactions_details_page_summary_item'>
            <label className='transactions_details_page_summary_item_title'>SUBTOTAL</label>
            <p className='transactions_details_page_summary_item_value'>{cellInformation.subtotalPrice}</p>
          </div>
          <div className='transactions_details_page_summary_item'>
            <label className='transactions_details_page_summary_item_title'>GST and Taxes</label>
            <p className='transactions_details_page_summary_item_value'>{cellInformation.taxPrice}</p>
          </div>
          <div className='transactions_details_page_summary_item'>
            <label className='transactions_details_page_summary_item_title'>Bill Total</label>
            <p className='transactions_details_page_summary_item_value'>{cellInformation.totalPrice}</p>
          </div>
          <div className='transactions_details_page_summary_acknowledgement'>
            <label className='transactions_details_page_summary_acknowledgement_title'>PAYMENT ACKNOWLEDGEMENT</label>
            <p className='transactions_details_page_summary_acknowledgement_description'>The total Invoice amount has
              been
              fully paid by {cellInformation.customerFullName} without any deductions. The bill total has been rounded
              off to the
              nearest
              whole number.</p>
          </div>
        </div>
      </div>
    </div>
  </Page>
}

export default TransactionsDetailsPage;
