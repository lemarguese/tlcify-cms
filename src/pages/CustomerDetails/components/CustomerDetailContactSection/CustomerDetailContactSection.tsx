import type { FC, ReactNode } from "react";
import './CustomerDetailContactSection.scss';

interface CustomerDetailContactSectionProps {
  title: string;
  content: string;
  icon: ReactNode;
}

const CustomerDetailContactSection: FC<CustomerDetailContactSectionProps> = ({ title, content, icon }) => {
  return <div className='customer_details_page_contacts_section'>
    <div className='customer_details_page_contacts_section_icon'>
      {icon}
    </div>
    <div className='customer_details_page_contacts_section_content'>
      <h6>{title}</h6>
      <p>{content}</p>
    </div>
  </div>
}

export default CustomerDetailContactSection;
