import './ForbiddenPage.scss';

import ForbiddenImage from '@/assets/images/forbidden_page_image.svg';
import Button from "@/components/Button/Button.tsx";
import { useNavigate } from "react-router";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return <div className='forbidden_page'>
    <img alt='forbidden-page-image' src={ForbiddenImage} className='forbidden_page_image'/>
    <div className='forbidden_page_content'>
      <label className='forbidden_page_content_title'>Oops! Something went wrong...</label>
      <p className='forbidden_page_content_description'>The page you are looking is either not available or cannot be
        found, go back to home page</p>
      <Button onClick={() => navigate('/')} variant='solid' type='primary'>Go home</Button>
    </div>
  </div>
}

export default ForbiddenPage;
