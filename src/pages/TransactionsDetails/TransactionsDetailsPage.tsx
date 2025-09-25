import './TransactionsDetailsPage.scss';

import Page from "@/layout/Page/Page.tsx";
import Table from "@/components/Table/Table.tsx";

const TransactionsDetailsPage = () => {

  // todo payment get by id
  return <Page showSearch={false}>
    <div className='transactions_details_page'>
      <div className='transactions_details_page_container'>
        <div className='transactions_details_page_label'>
          <label className='transactions_details_page_label_text'>PAYMENT INFORMATION</label>
        </div>
        <div className='transactions_details_page_accords'>
          <div className='transactions_details_page_accords_title'>
            <label className='transactions_details_page_accords_title_text'>RECEIPT TO</label>
            <p className='transactions_details_page_accords_title_name'>Entity name</p>
          </div>
          <div className='transactions_details_page_accords_invoice'>
            <label className='transactions_details_page_accords_invoice_number'>TRANSACTION NUMBER</label>
          </div>
        </div>
        <div className='transactions_details_page_date'>
          <div className='transactions_details_page_date_received'>
            <label className='transactions_details_page_date_title'>DATE RECEIVED</label>
            <p className='transactions_details_page_date_value'>DD / MM / YYYY</p>
          </div>
          <div className='transactions_details_page_date_issued'>
            <label className='transactions_details_page_date_title'>DATE ISSUED</label>
            <p className='transactions_details_page_date_value'>DD / MM / YYYY</p>
          </div>
        </div>
        <div className='transactions_details_page_description'>
          <label className='transactions_details_page_description_title'>POLICY DESCRIPTION</label>
          <p className='transactions_details_page_description_text'>A brief overview of the project, including its
            objectives and scope. This section should summarize what the project entailed and the services provided.</p>
        </div>
        <div className='transactions_details_page_paid transactions_details_page_paid_by'>
          <label className='transactions_details_page_paid_title'>PAID BY</label>
          <div className='transactions_details_page_paid_content'>
            <div className='transactions_details_page_paid_content_names'>
              <h4 className='transactions_details_page_paid_content_names_title'>FIRST LAST</h4>
              <p className='transactions_details_page_paid_content_names_value'>Entity Name</p>
            </div>
            <div className='transactions_details_page_paid_content_site'>
              <a className='transactions_details_page_paid_content_site_text'>website.com</a>
            </div>
            <div className='transactions_details_page_paid_content_address'>
              <p className='transactions_details_page_paid_content_address_text'>No.00, ABC Street, ABC,
                City - 000000, State, Country</p>
            </div>
            <div className='transactions_details_page_paid_content_email'>
              <p className='transactions_details_page_paid_content_email_text'>customer@mail.com</p>
            </div>
          </div>
          <div className='transactions_details_page_paid_footer'>
            <div className='transactions_details_page_paid_footer_issuer'>
              <label className='transactions_details_page_paid_footer_issuer_label'>ISSUER</label>
              <label className='transactions_details_page_paid_footer_issuer_text'>insurance@tlcify.com</label>
            </div>
          </div>
        </div>
        <div className='transactions_details_page_items'>
          <Table actions={<></>}/>
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
            <p className='transactions_details_page_summary_item_value'>₹
              00,000</p>
          </div>
          <div className='transactions_details_page_summary_item'>
            <label className='transactions_details_page_summary_item_title'>GST and Taxes</label>
            <p className='transactions_details_page_summary_item_value'>₹
              00,000</p>
          </div>
          <div className='transactions_details_page_summary_item'>
            <label className='transactions_details_page_summary_item_title'>Bill Total</label>
            <p className='transactions_details_page_summary_item_value'>$ 0,00,000</p>
          </div>
          <div className='transactions_details_page_summary_acknowledgement'>
            <label className='transactions_details_page_summary_acknowledgement_title'>PAYMENT ACKNOWLEDGEMENT</label>
            <p className='transactions_details_page_summary_acknowledgement_description'>The total Invoice amount has
              been
              fully paid by Name of Entity name without any deductions. The bill total has been rounded off to the
              nearest
              whole number.</p>
          </div>
        </div>
      </div>
    </div>
  </Page>
}

export default TransactionsDetailsPage;
