import { useCallback, useState } from "react";

import VisaIcon from "@/assets/icons/payment/visa_icon.svg";
import MastercardIcon from "@/assets/icons/payment/mastercard_icon.svg";
import StripeIcon from "@/assets/icons/payment/stripe_icon.svg";
import GooglePayIcon from "@/assets/icons/payment/google_pay_icon.svg";
import PaypalIcon from "@/assets/icons/payment/paypal_icon.svg";

import Input from "@/components/Input/Input.tsx";
import Selector from "@/components/Selector/Selector.tsx";

export const getPaymentFunctions = () => {
  // const [paymentForm, setPaymentForm] = useState();

  const [paymentType, setPaymentType] = useState<'check' | 'card' | 'unselected'>('unselected');
  const [isPaymentTypeModalOpen, setIsPaymentTypeModalOpen] = useState(true);

  const cancelPaymentTypeModal = useCallback(() => {
    setIsPaymentTypeModalOpen(false);
  }, []);

  const cardForm = <>
    <div className='auto_pay_page_right_payment'>
      <label className='auto_pay_page_right_payment_title'>Payment methods</label>
      <div className='auto_pay_page_right_payment_list'>
        <img alt='auto-pay-payment-visa-icon' src={VisaIcon} className='auto_pay_page_right_payment_list_icon'/>
        <img alt='auto-pay-payment-mastercard-icon' src={MastercardIcon}
             className='auto_pay_page_right_payment_list_icon'/>
        <img alt='auto-pay-payment-stripe-icon' src={StripeIcon} className='auto_pay_page_right_payment_list_icon'/>
        <img alt='auto-pay-payment-googlepay-icon' src={GooglePayIcon}
             className='auto_pay_page_right_payment_list_icon'/>
        <img alt='auto-pay-payment-paypal-icon' src={PaypalIcon} className='auto_pay_page_right_payment_list_icon'/>
      </div>
    </div>
    <div className='auto_pay_page_right_card'>
      <label className='auto_pay_page_right_card_title'>Card details</label>
      <div className='auto_pay_page_right_card_public'>
        <Input label='Cardholder’s name' placeholder='Ex. John Doe' required/>
        <Input label='Card number' placeholder='1234 1234 1234 1234' required/>
      </div>
      <div className='auto_pay_page_right_card_private'>
        <Input label='Expirity' placeholder='20/23' required/>
        <Input label='CVC' placeholder='777' required/>
      </div>
    </div>
  </>

  const checkForm = <div className='auto_pay_page_right_check'>
    <label className='auto_pay_page_right_check_title'>Check details</label>
    <div className='auto_pay_page_right_card_public'>
      <Input label='Checkholder’s name' placeholder='Ex. John Doe' required/>
      <Input label='Routing number' placeholder='1234 1234 1234 1234' required/>
    </div>
    <div className='auto_pay_page_right_card_private'>
      <Input label='Account number' placeholder='20/23' required/>
      <Input label='Confirm account number' placeholder='777' required/>
    </div>
    <div className='auto_pay_page_right_card_private'>
      <Selector label='Account Type' options={checkAccountTypeOptions} required/>
      <Selector label='Account entity type' options={checkAccountEntityTypeOptions} required/>
    </div>
  </div>

  return {
    cancelPaymentTypeModal,
    isPaymentTypeModalOpen,
    paymentType, setPaymentType,

    paymentFormElement: paymentType === 'card' ? cardForm : checkForm
  }
}

export const checkAccountTypeOptions = [
  { label: 'Checking', value: 'checking' },
  { label: 'Saving', value: 'saving' },
];

export const checkAccountEntityTypeOptions = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
];
