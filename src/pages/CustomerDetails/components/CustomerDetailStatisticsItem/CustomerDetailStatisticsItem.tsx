import './CustomerDetailStatisticsItem.scss';
import Statistic from "@/components/Statistic/Statistic.tsx";

interface CustomerDetailStatisticsItemProps {
  title: string;
  description: string;
}

const CustomerDetailStatisticsItem = ({ title, description }: CustomerDetailStatisticsItemProps) => {
  return <div className='customer_detail_statistics_item'>
    <Statistic value={description} title={title}/>
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
