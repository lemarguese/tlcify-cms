import './TotalTableFooter.scss';
import { Divider } from "antd";

interface TransactionDetailTotalTableFooterProps {
  totalAmount: string;
  totalFees: string;
  totalPrice: string;
}

const TransactionDetailTotalTableFooter = ({ totalAmount, totalFees, totalPrice }: TransactionDetailTotalTableFooterProps) => {
  return <div className='transaction_details_total_table_footer_container'>
    <div className='transaction_details_total_table_footer'>
      <div className='transaction_details_total_table_footer_item'>
        <p>Total Due Amount: </p>
        <p>{totalAmount}</p>
      </div>
      <div className='transaction_details_total_table_footer_item'>
        <p>Total Fees by Due Date: </p>
        <p>{totalFees}</p>
      </div>
      {/*<div className='transaction_details_total_table_footer_item'>*/}
      {/*  <p>Total VAT</p>*/}
      {/*  <p>€30</p>*/}
      {/*</div>*/}
      <Divider className='transaction_details_total_table_footer_divider'/>
      <div className='transaction_details_total_table_footer_item'>
        <p>Total Price: </p>
        <p>{totalPrice}</p>
      </div>
    </div>
  </div>
}

export default TransactionDetailTotalTableFooter;
