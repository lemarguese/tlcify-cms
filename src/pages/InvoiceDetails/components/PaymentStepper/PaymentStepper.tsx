import type { FC } from "react";
import './PaymentStepper.scss';


interface TransactionsDetailsPaymentStepperProps {
  hasNext?: boolean;
}

const TransactionsDetailsPaymentStepper: FC<TransactionsDetailsPaymentStepperProps> = ({ hasNext = false }) => {
  return <div className='transaction_details_payment_stepper'>
    <div className='transaction_details_payment_stepper_status'>
      <div className='transaction_details_payment_stepper_status_circle'></div>
      {hasNext && <div className='transaction_details_payment_stepper_status_line'></div>}
    </div>
    <div className='transaction_details_payment_stepper_content'>
      <p>Deposit No. 2020-04-0006</p>
      <div className='transaction_details_payment_stepper_content_item'>
        <p>Date</p>
        <p>Oct 24, 2019</p>
      </div>
      <div className='transaction_details_payment_stepper_content_item'>
        <p>Amount</p>
        <p>€300</p>
      </div>
    </div>
  </div>
}

export default TransactionsDetailsPaymentStepper;
