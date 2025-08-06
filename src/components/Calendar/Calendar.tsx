import './Calendar.scss';
import 'react-calendar/dist/Calendar.css';

import { Calendar as WojtekCalendar } from "react-calendar";
import type { CalendarProps } from 'react-calendar';
import type { FC } from "react";

interface CustomCalendarProps extends CalendarProps {

}

const Calendar: FC<CustomCalendarProps> = (props) => {
  return <div className='calendar'>
    <div className="calendar_container">
      <main className="calendar_container_content">
        <WojtekCalendar {...props} locale='en'/>
      </main>
    </div>
  </div>
}

export default Calendar;
