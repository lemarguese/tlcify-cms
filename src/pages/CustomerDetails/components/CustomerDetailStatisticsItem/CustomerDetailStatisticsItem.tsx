import './CustomerDetailStatisticsItem.scss';

interface CustomerDetailStatisticsItemProps {
  title: string;
  description: string;
}

const CustomerDetailStatisticsItem = ({ title, description }: CustomerDetailStatisticsItemProps) => {
  return <div className='customer_detail_statistics_item'>
    <div className='customer_detail_statistics_item_header'>
      <div className='customer_detail_statistics_item_header_icon_block'>
        <div className='customer_detail_statistics_item_header_icon_block_icon'/>
        <p>{title}</p>
      </div>
      <p>{description}</p>
    </div>
    {/*<div className='customer_details_page_statistics_item_footer'>*/}
    {/*  <div className='customer_details_page_statistics_item_footer_content'>*/}
    {/*    <h6>Points Used</h6>*/}
    {/*    <p>150</p>*/}
    {/*  </div>*/}
    {/*  <div className='customer_details_page_statistics_item_footer_content'>*/}
    {/*    <h6>Points Used</h6>*/}
    {/*    <p>150</p>*/}
    {/*  </div>*/}
    {/*</div>*/}
  </div>
}

export default CustomerDetailStatisticsItem;
