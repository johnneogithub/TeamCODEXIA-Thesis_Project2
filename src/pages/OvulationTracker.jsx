import React, { useState } from 'react';

const OvulationTracker = () => {
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState('');
  const [predictedDay, setPredictedDay] = useState(null);
  const [error, setError] = useState(null);

  // Function to format the date as mm-dd-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
    return formattedDate;
  };

  // Function to calculate the difference in days between the last menstrual period and the predicted ovulation day
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
      setPredictedDay(formatDate(data.predicted_ovulation_day)); // Use formatDate to format the date
      setError(null);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Error making prediction. Please check the console for more details.');
    }
  };

  return (
    <div className="card text-center">
      <div className="card-header">Ovulation Tracker</div>
      <div className="card-body">
        <h5 className="card-title">Check your next ovulation!</h5>
        <p className="card-text">Set your last menstrual period and let us predict the next ovulation day!</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Last Menstrual Period:</label>
            <input
              type="date"
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
  );
};

export default OvulationTracker;