import React, { useState } from 'react';
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
      const response = await fetch('http://178.128.219.25/predict', {
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
  
  return (
    <>
      <div className="app-container d-flex justify-content-center align-items-center vh-100 position-relative">
        <div className="position-absolute d-flex flex-column w-100 align-items-center top-10 translate-middle-y ot-header">
          <div className="d-flex w-100 justify-content-center align-items-center mb-4">
            <div className="d-flex bg-white align-items-center w-50 px-3 py-3 rounded app-shadow mx-3">
              <span className="font-ovu app-color-black ml-2 mr-auto text-xs text-justify">Ovulation Tracker</span>
            </div>

            <div className="d-flex app-bg-light-white rounded px-3 py-3 app-shadow mx-3">
              <a href="/Chatbot" className="app-color-black text-justify" style={{ textDecoration: 'none' }}>
                <span className="font-ovu app-color-black text-xs">PlanIt Assistant</span>
              </a>
            </div>
            <div className="d-flex app-bg-light-white rounded px-3 py-3 app-shadow mx-3">
              <a href="/Home" className="app-color-black text-justify" style={{ textDecoration: 'none' }}>
                <span className="font-ovu app-color-black text-xs">Home</span>
              </a>
            </div>
          </div>

          <div className="d-flex flex-column text-center my-5">
            <span className="font-weight-semibold display-5 mb-3 app-title text-justify">Know your next Ovulation Day!</span>
            <span className="app-color-black font-weight-semibold app-subtitle text-justify">Be protected and secured, let us track your next ovulation date.</span>
          </div>
          
          <div className="bg-white-10 w-75 px-3 pt-5 pb-5 app-shadow">
            <div className="d-flex justify-content-center mb-3">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <h2 className="text-justify">Last Menstrual Period:</h2>
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
                <div className="card1 bg-c-yellow output-card">
                  <div className="card-block">
                    <div className="output_text text-justify">
                      <p>Your Ovulation Date</p>
                      {predictedDay && lastMenstrualPeriod ? (
                        <>
                          <div className='outputOT'>{`Ovulation Date: ${predictedDay}`}</div>
                          <div className='outputOT'>{`${calculateDaysBetween(lastMenstrualPeriod, predictedDay)} days until ovulation`}</div>
                          <div className='output_src'>
                            <p>Source
                              <a href="https://scholar.smu.edu/datasciencereview/vol1/iss1/2/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                :  Forecasting Ovulation for Family Planning
                              </a>
                            </p>
                          </div>
                        </>
                      ) : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xl-3"> {/* this is the second card */}
                <div className="card2 bg-white disclaimer-card">
                  <div className="disclaimer_text">
                    <div className="disclaimer_text text-justify">
                      <h2> Disclaimer </h2>
                      <p> As per professional, not advisable for women having irregular menstruation.</p>
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
