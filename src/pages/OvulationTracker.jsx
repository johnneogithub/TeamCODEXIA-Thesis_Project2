import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/OTDesignStyle.css';

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
      <div className="app-container d-flex justify-content-center align-items-center vh-100 position-relative">
        <div className="circle rounded-circle"></div>
        <div className="circle2 rounded-circle"></div>
        <div className="position-absolute d-flex flex-column w-100 align-items-center top-10 translate-middle-y ot-header">
          <div className="d-flex w-100 justify-content-center align-items-center mb-4">
            <div className="d-flex bg-white align-items-center w-50 px-3 py-3 rounded app-shadow mx-3">
              <span className="font-ovu app-color-black ml-2 mr-auto text-xs">Ovulation Tracker</span>
            </div>

            <div className="d-flex app-bg-light-white rounded px-3 py-3 app-shadow mx-3">
              <a href="/Chatbot" className="app-color-black" style={{ textDecoration: 'none' }}>
                <span className="font-ovu app-color-black text-xs">PlanIt Assistant</span>
              </a>
            </div>
            <div className="d-flex app-bg-light-white rounded px-3 py-3 app-shadow mx-3">
              <a href="/Home" className="app-color-black" style={{ textDecoration: 'none' }}>
                <span className="font-ovu app-color-black text-xs">Home</span>
              </a>
            </div>
          </div>

          <div className="d-flex flex-column text-center my-5">
            <span className="font-weight-semibold display-5 mb-3 app-title">Know your next Ovulation Day!</span>
            <span className="app-color-black font-weight-semibold app-subtitle">Be protected and secured, let us track your next ovulation date.</span>
          </div>
          
          <div className="bg-white-10 w-75 px-3 pt-5 pb-5 app-shadow">
            <div className="d-flex justify-content-center mb-3">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <h2>Last Menstrual Period:</h2>
                  <input
                    type="date"
                    className="form-control"
                    value={lastMenstrualPeriod}
                    onChange={(e) => setLastMenstrualPeriod(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" data-mdb-ripple-init>Predict Ovulation Day</button>
              </form>

              <div className="col-md-4 col-xl-3">
                <div className="card bg-c-yellow output-card">
                  <div className="card-block">
                    <div className="output_text">
                      <p>Your ovulation date</p>
                      {predictedDay && lastMenstrualPeriod ? (
                        <>
                          <div className='outputOT'>{`Ovulation Date: ${predictedDay}`}</div>
                          <div className='outputOT'>{`${calculateDaysBetween(lastMenstrualPeriod, predictedDay)} days until ovulation`}</div>
                          <div className='output_src'>
                            <p>Source
                              <a href="https://scholar.smu.edu/datasciencereview/vol1/iss1/2/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                :  Forecasting Ovulation <br />for Family Planning
                              </a>
                            </p>
                          </div>
                        </>
                      ) : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </>
  )
}

export default OvulationTracker;
