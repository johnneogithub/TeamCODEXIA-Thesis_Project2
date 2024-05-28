import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/OvulationTrackerStyle.css';

const OvulationTracker = () => {
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState('');
  const [predictedDay, setPredictedDay] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
    return formattedDate;
  };

  const calculateDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = end.getTime() - start.getTime();
    const daysBetween = Math.floor(difference / (1000 * 3600 * 24));
    return daysBetween;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          last_menstrual_period: lastMenstrualPeriod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      setPredictedDay(formatDate(data.predicted_ovulation_day));
      setError(null);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Error making prediction. Please check the console for more details.');
    }
  };

  useEffect(() => {
    const interBubble = document.querySelector('.interactive');
    if (!interBubble) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(move);
    }

    window.addEventListener('mousemove', (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    });

    move();
  }, []);

  return (
    <>
      <div className="app-container d-flex justify-content-center align-items-center vh-100 position-relative" style={{ maxWidth: '600px' }}>
        <div className="circle rounded-circle"></div>
        <div className="position-absolute d-flex flex-column w-100 align-items-center top-50 translate-middle-y">
          <div className="d-flex w-100 justify-content-center align-items-center mb-4">
            <div className="d-flex px-3">
              <div className="h-2 w-2 rounded-circle mx-1 red"></div>
              <div className="h-2 w-2 rounded-circle mx-1 yellow"></div>
              <div className="h-2 w-2 rounded-circle mx-1 green"></div>
            </div>
            <div className="d-flex bg-white align-items-center w-50 px-3 py-2 rounded app-shadow mx-3">
              <i className="fa-solid fa-star app-color-yellow text-xs"></i>
              <span className="font-weight-bold app-color-black ml-2 mr-auto text-xs">wizzair.com</span>
              <i className="fa-solid fa-ellipsis app-color-lavendar"></i>
            </div>
            <div className="d-flex app-bg-light-white rounded px-3 py-2 app-shadow mx-3">
              <i className="fa-brands fa-dribbble app-color-dribbble mr-2"></i>
              <span className="font-weight-bold app-color-black text-xs">Dribbble</span>
            </div>
            <div className="d-flex bg-white px-3 py-2 app-shadow rounded mx-3">
              <span className="font-weight-bold app-color-black text-xs">Book now</span>
              <div className="w-1 app-bg-light-white-2 mx-2"></div>
              <i className="fa-regular fa-user mr-2 app-color-black"></i>
              <i className="fa-solid fa-angle-down text-xs app-color-black"></i>
            </div>
          </div>
          <div className="d-flex flex-column text-center my-5">
            <span className="font-weight-semibold display-4 mb-4 app-title">Where would you like to go?</span>
            <span className="app-color-black font-weight-semibold">Explore your travel opportunities with us!</span>
          </div>
          <div className="bg-white-50 w-75 px-3 pt-5 pb-5 app-shadow rounded-xl backdrop-blur-[200px]">
            <div className="d-flex justify-content-center mb-4">
              <span className="font-weight-semibold small app-color-gray mx-3">Flights</span>
              <span className="font-weight-semibold small app-color-gray mx-3">Hotels</span>
              <span className="font-weight-semibold small app-color-gray mx-3 active">Cars</span>
              <label className="d-flex align-items-center cursor-pointer ml-3">
                <span className="font-weight-semibold small app-color-black mr-3">One way</span>
                <div className="switch">
                  <input type="checkbox" className="switch-checkbox" />
                  <div className="switch-bg"></div>
                  <div className="switch-indicator"></div>
                </div>
              </label>
            </div>
            <div className="d-flex justify-content-center">
              <div className="bg-white-80 mx-3 d-flex flex-column w-33 p-3 rounded border-2 border-white text-center">
                <span className="font-weight-semibold small app-color-lavendar">Leaving from</span>
                <span className="font-weight-semibold large app-color-black">Georgia, Tbilisi</span>
              </div>
              <div className="bg-white-80 mx-3 d-flex flex-column w-33 p-3 rounded border-2 border-white text-center">
                <span className="font-weight-semibold small app-color-lavendar">Destination</span>
                <span className="font-weight-semibold large app-color-pink">France, Paris</span>
              </div>
              <div className="bg-white-80 mx-3 d-flex flex-column w-33 p-3 rounded border-2 border-white text-center">
                <span className="font-weight-semibold small app-color-lavendar">Passengers</span>
                <span className="font-weight-semibold large app-color-black">2 adults, 3 children, 1 pet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card text-center mx-auto my-4" style={{ maxWidth: '600px' }}>
        <div className="card-header">Ovulation Tracker</div>
        <div className="card-body">
          <h5 className="card-title">Check your next ovulation!</h5>
          <p className="card-text">Set your last menstrual period and let us predict the next ovulation day!</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Last Menstrual Period:</label>
              <input
                type="date"
                className="form-control"
                value={lastMenstrualPeriod}
                onChange={(e) => setLastMenstrualPeriod(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" data-mdb-ripple-init>Predict Ovulation Day</button>
          </form>
        </div>
        <div className="card-footer text-muted">
          {predictedDay && lastMenstrualPeriod ? (
            <>
              <div>{`Ovulation Date: ${predictedDay}`}</div>
              <div>{`${calculateDaysBetween(lastMenstrualPeriod, predictedDay)} days until ovulation`}</div>
            </>
          ) : ''}
        </div>
      </div>
    </>
  );
};

export default OvulationTracker;
