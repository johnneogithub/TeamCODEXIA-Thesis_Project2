// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom
// import '../pages/CalendarStyle.css';

// const CalendarAppointment = () => {
//   const [currYear, setCurrYear] = useState(new Date().getFullYear());
//   const [currMonth, setCurrMonth] = useState(new Date().getMonth());
//   const [clickedDate, setClickedDate] = useState(null); 
//   const [showSubmitButton, setShowSubmitButton] = useState(false); // 
//   const history = useHistory(); 
  
//   const months = ["January", "February", "March", "April", "May", "June", "July",
//               "August", "September", "October", "November", "December"];

//   const renderCalendar = () => {
//     const firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
//     const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
//     const lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
//     const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

//     let calendarItems = [];

//     // Add inactive days from the previous month
//     for (let i = firstDayofMonth; i > 0; i--) {
//       calendarItems.push(
//         <li key={`inactive-${i}`} className="inactive">
//           {lastDateofLastMonth - i + 1}
//         </li>
//       );
//     }

//     // Add active days for the current month
//     for (let i = 1; i <= lastDateofMonth; i++) {
//       let isToday = i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear();
//       calendarItems.push(
//         <li key={`active-${i}`} className={isToday ? "active" : ""} onClick={() => handleDateClick(i)}>
//           {i}
//         </li>
//       );
//     }

//     // Add inactive days from the next month
//     for (let i = lastDayofMonth; i < 6; i++) {
//       calendarItems.push(
//         <li key={`inactive-next-${i}`} className="inactive">
//           {i - lastDayofMonth + 1}
//         </li>
//       );
//     }

//     return calendarItems;
//   }

//   const handlePrevNextClick = (type) => {
//     if (type === 'prev') {
//       setCurrMonth(currMonth - 1);
//     } else {
//       setCurrMonth(currMonth + 1);
//     }
//     if (currMonth < 0 || currMonth > 11) {
//       const newDate = new Date(currYear, currMonth, new Date().getDate());
//       setCurrYear(newDate.getFullYear());
//       setCurrMonth(newDate.getMonth());
//     }
//   }

//   const handleDateClick = (clickedDate) => {
//     setClickedDate(clickedDate); 
//     setShowSubmitButton(true); 
//   }

//   const handleSubmit = () => {
//     const formattedMonth = String(currMonth + 1).padStart(2, '0'); 
//     history.push({
//       pathname: '/FillUpAppointment',
//       state: { selectedDate: `${currYear}-${formattedMonth}-${clickedDate}` } 
//     });
//   }

//   return (
//     <div className='wrapper_body'>
//       <div className="main_wrapper">
//         <header className='wrapper_header'>
//           <p className="current-date">{`${months[currMonth]} ${currYear}`}</p>
//           <div className="icons">
//             <span id="prev" className="material-symbols-rounded" onClick={() => handlePrevNextClick('prev')}> </span>
//             <span id="next" className="material-symbols-rounded" onClick={() => handlePrevNextClick('next')}></span>
//           </div>
//         </header>
//         <div className="calendar_main">
//           <ul className="weeks">
//             <li>Sun</li>
//             <li>Mon</li>
//             <li>Tue</li>
//             <li>Wed</li>
//             <li>Thu</li>
//             <li>Fri</li>
//             <li>Sat</li>
//           </ul>
//           <ul className="days">{renderCalendar()}</ul>
//         </div>
//         {/* Display clicked date */}
//       </div>
//     <div className='new_functions'>
//     {clickedDate && (
//           <p className="clicked-date">{`${months[currMonth]} ${clickedDate}, ${currYear}`}</p>
//         )}
//       {showSubmitButton && (
//         <button className="submit-button" onClick={handleSubmit}>Submit</button>
//       )}
//     </div>
//     </div>
//   );
// }

// export default CalendarAppointment;
