import type { FC } from "react";
import './CustomerDetailContactSection.scss';

interface CustomerDetailContactSectionProps {
  title: string;
  content: string;
  iconUrl: string;
  backgroundColor: string;
}

const CustomerDetailContactSection: FC<CustomerDetailContactSectionProps> = ({ title, content, iconUrl, backgroundColor }) => {
  return <div className='customer_details_page_contacts_section' style={{ backgroundColor }}>
    <div className='customer_details_page_contacts_section_icon'>
      <img src={iconUrl} alt={`${title}-icon`} />
    </div>
    <div className='customer_details_page_contacts_section_content'>
      <h6>{title}</h6>
      <p>{content}</p>
    </div>
  </div>
}

export default CustomerDetailContactSection;
