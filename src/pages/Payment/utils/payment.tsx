import { BaseSyntheticEvent, useCallback, useState } from "react";

import VisaIcon from "@/assets/icons/payment/visa_icon.svg";
import MastercardIcon from "@/assets/icons/payment/mastercard_icon.svg";
import StripeIcon from "@/assets/icons/payment/stripe_icon.svg";
import GooglePayIcon from "@/assets/icons/payment/google_pay_icon.svg";
import PaypalIcon from "@/assets/icons/payment/paypal_icon.svg";

import Input from "@/components/Input/Input.tsx";
import Selector from "@/components/Selector/Selector.tsx";
import { instance } from "@/api/axios.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import type { AxiosError } from "axios";
import type { IAchCustomerAddress, IAchDetails, ICreditCardDetails } from "@/types/billing/main.ts";
import { AccountType, CheckType } from "@/types/billing/main.ts";
import { useNavigate } from "react-router";

const paymentFormInitialState: IAchDetails & ICreditCardDetails = {
  accountNumber: '',
  accountType: AccountType.Checking,
  customerBillingAddress: {
    streetAddress: '',
    state: '',
    postalCode: '',
    city: ''
  },
  checkHolderName: '',
  verificationCode: '',
  monthExpiration: '',
  yearExpiration: '',
  checkType: CheckType.Business,
  cardHolderName: '',
  number: '',
  routingNumber: '',
}

export const getPaymentFunctions = (invoiceId?: string) => {
  const { error, success } = useNotify();
  const navigate = useNavigate();

  const [paymentForm, setPaymentForm] = useState<IAchDetails & ICreditCardDetails>(paymentFormInitialState);

  const [paymentType, setPaymentType] = useState<'ach' | 'card' | 'unselected'>('unselected');
  const [isPaymentTypeModalOpen, setIsPaymentTypeModalOpen] = useState(true);

  const cancelPaymentTypeModal = useCallback(() => {
    setIsPaymentTypeModalOpen(false);
  }, []);

  const changeInput = useCallback((key: keyof (IAchDetails & ICreditCardDetails)) => {
    return (val: BaseSyntheticEvent | string) => {
      setPaymentForm(prev => ({
        ...prev,
        [key]: typeof val === 'string' ? val : val.target.value
      }))
    }
  }, []);

  const changeAddress = useCallback((key: keyof IAchCustomerAddress) => {
    return (val: BaseSyntheticEvent) => {
      setPaymentForm(prev => ({
        ...prev,
        customerBillingAddress: {
          ...prev.customerBillingAddress,
          [key]: val.target.value
        }
      }))
    }
  }, [])

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
        <Input label='Cardholder’s name' placeholder='Ex. John Doe' value={paymentForm.cardHolderName} required
               onChange={changeInput('cardHolderName')}/>
        <Input label='Card number' placeholder='1234 1234 1234 1234' value={paymentForm.number} required
               onChange={changeInput('number')}/>
      </div>
      <div className='auto_pay_page_right_card_private'>
        <Input label='Expiration month' placeholder='02' value={paymentForm.monthExpiration} required
               onChange={changeInput('monthExpiration')}/>
        <Input label='Expiration year' placeholder='2023' value={paymentForm.yearExpiration} required
               onChange={changeInput('yearExpiration')}/>
        <Input label='CVC' placeholder='777' required value={paymentForm.verificationCode}
               onChange={changeInput('verificationCode')}/>
      </div>
    </div>
  </>

  const checkForm = <div className='auto_pay_page_right_check'>
    <label className='auto_pay_page_right_check_title'>Check details</label>
    <div className='auto_pay_page_right_card_public'>
      <Input label='Checkholder’s name' placeholder='Ex. John Doe' value={paymentForm.checkHolderName} required
             onChange={changeInput('checkHolderName')}/>
      <Input label='Routing number' placeholder='1234 1234 1234 1234' value={paymentForm.routingNumber} required
             onChange={changeInput('routingNumber')}/>
    </div>
    <div className='auto_pay_page_right_card_private'>
      <Input label='Account number' placeholder='20/23' value={paymentForm.accountNumber} required
             onChange={changeInput('accountNumber')}/>
      <Input label='Confirm account number' placeholder='777' required/>
    </div>
    <div className='auto_pay_page_right_card_private'>
      <Selector label='Account Type' options={checkAccountTypeOptions} value={paymentForm.accountType} required
                onChange={changeInput('accountType')}/>
      <Selector label='Account entity type' options={checkAccountEntityTypeOptions} value={paymentForm.checkType}
                required
                onChange={changeInput('checkType')}/>
    </div>
  </div>;

  const executeCharging = async () => {
    try {
      await instance.post('/billing', {
        type: paymentType,
        invoiceId,
        ...paymentForm,
      });
      success('Payment successfully processed!');
      setTimeout(() => navigate('/customers'), 1000)
    } catch (e: unknown) {
      error((e as AxiosError).message);
    }
  }

  return {
    cancelPaymentTypeModal,
    isPaymentTypeModalOpen,
    paymentType, setPaymentType,

    executeCharging,
    changeAddress,
    paymentForm,

    paymentFormElement: paymentType === 'card' ? cardForm : checkForm
  }
}

export const checkAccountTypeOptions = [
  { label: 'Checking', value: AccountType.Checking },
  { label: 'Savings', value: AccountType.Savings },
];

export const checkAccountEntityTypeOptions = [
  { label: 'Personal', value: CheckType.Personal },
  { label: 'Business', value: CheckType.Business },
];
