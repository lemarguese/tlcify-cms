import './PaymentPage.scss';
import Input from "@/components/Input/Input.tsx";

import Button from "@/components/Button/Button.tsx";
import PaymentTypeModal from "@/pages/Payment/components/PaymentTypeModal/PaymentTypeModal.tsx";
import { getPaymentFunctions } from "@/pages/Payment/utils/payment.tsx";
import { useParams } from "react-router";

const PaymentPage = () => {
  const { invoiceId } = useParams();

  const {
    isPaymentTypeModalOpen,
    cancelPaymentTypeModal,
    paymentType,
    setPaymentType,
    executeCharging,
    changeAddress,
    paymentForm,
    paymentFormElement
  } = getPaymentFunctions(invoiceId);

  return <>
    <div className='auto_pay_page'>
      <div className='auto_pay_page_left'>
        <div className='auto_pay_page_left_container'>
          <div className='auto_pay_page_left_icon'></div>
          <div className='auto_pay_page_left_content'>
            <h4 className='auto_pay_page_left_content_name'>TLCify.com</h4>
            <p className='auto_pay_page_left_content_description'>Stay Ahead. Stay Legal. Stay TLCified.</p>
          </div>
        </div>
        <div className='auto_pay_page_left_footer'>
          <p className='auto_pay_page_left_footer_text'>© 2025. TLCify.com. All Rights Reserved.</p>
        </div>
      </div>
      <div className='auto_pay_page_right'>
        <div className='auto_pay_page_right_container'>
          <h1 className='auto_pay_page_right_title'>Complete registration payment</h1>
          <div className='auto_pay_page_right_personal'>
            <label className='auto_pay_page_right_personal_title'>Personal details</label>
            <div className='auto_pay_page_right_personal_row'>
              <div className='auto_pay_page_right_personal_line'>
                <Input label='Address line' placeholder='P.o.Box 1223'
                       value={paymentForm.customerBillingAddress.streetAddress} onChange={changeAddress('streetAddress')} required/>
                <Input label='City' placeholder='Arusha' value={paymentForm.customerBillingAddress.city} required onChange={changeAddress('city')}/>
              </div>
              <div className='auto_pay_page_right_personal_line'>
                <Input label='State' placeholder='Arusha, Tanzania' value={paymentForm.customerBillingAddress.state}
                       required onChange={changeAddress('state')}/>
                <Input label='Postal Code' placeholder='9090' value={paymentForm.customerBillingAddress.postalCode}
                       required onChange={changeAddress('postalCode')}/>
              </div>
            </div>
          </div>
          {paymentFormElement}
          <Button variant='solid' size={'large'} className='auto_pay_page_right_submit'
                  onClick={executeCharging}>Submit</Button>
        </div>
        <div className='auto_pay_page_right_footer'>
          <p className='auto_pay_page_right_footer_text'>Instructions</p>
          <p className='auto_pay_page_right_footer_text'>License</p>
          <p className='auto_pay_page_right_footer_text'>Terms of Use</p>
          <p className='auto_pay_page_right_footer_text'>Privacy</p>
        </div>
      </div>
    </div>
    <PaymentTypeModal open={isPaymentTypeModalOpen} paymentType={paymentType} onChange={setPaymentType}
                      cancel={cancelPaymentTypeModal}/>
  </>
}

export default PaymentPage;
