import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; // Add this line to import custom CSS

const MypageCalendar = ({ dueDates = [] }) => {
  const [date, setDate] = useState(new Date());

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      console.log("Checking date:", dateStr); // Log each date checked
      if (dueDates.includes(dateStr)) {
        console.log("Highlighting date:", dateStr); // Log highlighted date
        return 'react-calendar__tile--highlight'; // Ensure this class matches the one in your CSS
      }
    }
    return null;
  };

  return (
    <div>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default MypageCalendar;
