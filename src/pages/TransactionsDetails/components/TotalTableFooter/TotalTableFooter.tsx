import type { FC } from "react";
import './TotalTableFooter.scss';
import { Divider } from "antd";

interface TransactionDetailTotalTableFooterProps {
  // todo any;
  item: any;
}

const TransactionDetailTotalTableFooter: FC<TransactionDetailTotalTableFooterProps> = ({ item }) => {
  return <div className='transaction_details_total_table_footer_container'>
    <div className='transaction_details_total_table_footer'>
      <div className='transaction_details_total_table_footer_item'>
        <p>Total HT</p>
        <p>€3,000</p>
      </div>
      <div className='transaction_details_total_table_footer_item'>
        <p>Total Disbursements</p>
        <p>€0</p>
      </div>
      <div className='transaction_details_total_table_footer_item'>
        <p>Total VAT</p>
        <p>€30</p>
      </div>
      <Divider className='transaction_details_total_table_footer_divider' />
      <div className='transaction_details_total_table_footer_item'>
        <p>Total Price</p>
        <p>€3,030.00</p>
      </div>
    </div>
  </div>
}

export default TransactionDetailTotalTableFooter;
