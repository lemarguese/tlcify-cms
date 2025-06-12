import './SalesSection.scss';
import { Button } from "antd";
import { DownloadOutlined, DollarCircleFilled } from '@ant-design/icons';

const SalesSection = () => {

  return <div className='customer_sales_section'>
    <div className='customer_sales_section_header'>
      <div className='customer_sales_section_header_content'>
        <h4 className='customer_sales_section_header_content_title'>Today’s Sales</h4>
        <h6 className='customer_sales_section_header_content_description'>Sales Summary</h6>
      </div>
      <Button icon={<DownloadOutlined />} size={"middle"}>Export </Button>
    </div>
    <div className='customer_sales_section_statistics'>
      <div className='customer_sales_section_chip'>
        <DollarCircleFilled className='customer_sales_section_chip_icon' size={40} />
        <div className='customer_sales_section_chip_content'>
          <h6 className='customer_sales_section_chip_content_title'>$1k</h6>
          <p className='customer_sales_section_chip_content_numbers'>Total Sales</p>
          <p className='customer_sales_section_chip_content_difference'>+8% from yesterday</p>
        </div>
      </div>
      <div className='customer_sales_section_chip'>
        <DollarCircleFilled />
        <div className='customer_sales_section_chip_content'>
          <h6 className='customer_sales_section_chip_content_title'>$1k</h6>
          <p className='customer_sales_section_chip_content_numbers'>Total Sales</p>
          <p className='customer_sales_section_chip_content_difference'>+8% from yesterday</p>
        </div>
      </div>
      <div className='customer_sales_section_chip'>
        <DollarCircleFilled />
        <div className='customer_sales_section_chip_content'>
          <h6 className='customer_sales_section_chip_content_title'>$1k</h6>
          <p className='customer_sales_section_chip_content_numbers'>Total Sales</p>
          <p className='customer_sales_section_chip_content_difference'>+8% from yesterday</p>
        </div>
      </div>
      <div className='customer_sales_section_chip'>
        <DollarCircleFilled />
        <div className='customer_sales_section_chip_content'>
          <h6 className='customer_sales_section_chip_content_title'>$1k</h6>
          <p className='customer_sales_section_chip_content_numbers'>Total Sales</p>
          <p className='customer_sales_section_chip_content_difference'>+8% from yesterday</p>
        </div>
      </div>
    </div>
  </div>
}

export default SalesSection;
