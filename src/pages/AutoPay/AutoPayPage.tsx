import './AutoPayPage.scss';
import Input from "@/components/Input/Input.tsx";

import VisaIcon from '@/assets/icons/payment/visa_icon.svg';
import MastercardIcon from '@/assets/icons/payment/mastercard_icon.svg';
import GooglePayIcon from '@/assets/icons/payment/google_pay_icon.svg';
import StripeIcon from '@/assets/icons/payment/stripe_icon.svg';
import PaypalIcon from '@/assets/icons/payment/paypal_icon.svg';
import Button from "@/components/Button/Button.tsx";

const AutoPayPage = () => {
  return <div className='auto_pay_page'>
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
              <Input label='Address line' placeholder='P.o.Box 1223'/>
              <Input label='City' placeholder='Arusha'/>
            </div>
            <div className='auto_pay_page_right_personal_line'>
              <Input label='State' placeholder='Arusha ,Tanzania'/>
              <Input label='Postal Code' placeholder='9090'/>
            </div>
          </div>
        </div>
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
            <Input label='Cardholder’s name' placeholder='Seen on your card'/>
            <Input label='Card number' placeholder='Seen on your card'/>
          </div>
          <div className='auto_pay_page_right_card_private'>
            <Input label='Expirity' placeholder='20/23'/>
            <Input label='CVC' placeholder='777'/>
          </div>
        </div>
        <Button variant='solid' size={'large'} className='auto_pay_page_right_submit'>Next</Button>
      </div>
      <div className='auto_pay_page_right_footer'>
        <p className='auto_pay_page_right_footer_text'>Instructions</p>
        <p className='auto_pay_page_right_footer_text'>License</p>
        <p className='auto_pay_page_right_footer_text'>Terms of Use</p>
        <p className='auto_pay_page_right_footer_text'>Privacy</p>
      </div>
    </div>
  </div>
}

export default AutoPayPage;
