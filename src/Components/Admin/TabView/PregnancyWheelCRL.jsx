import React, { useState, useEffect } from 'react';
import '../TabView/PregnancyWheelCRLStyle.css';
import moment from 'moment';
import Calendar from 'react-calendar';
import Modal from 'react-modal'

const PregnancyWheelCRL = () => {
  const [crl, setCrl] = useState('');
  const [USweeks, setUSweeks] = useState("");
  const [USdays, setUSdays] = useState("");
  const [EGAweeks, setEGAweeks] = useState("");
  const [EGAdays, setEGAdays] = useState("");
  const [LMP, setLMP] = useState(new Date());
  const [USDate, setUSDate] = useState(new Date());
  const [cycle, setCycle] = useState(28);
  const [showLmpCalendar, setShowLmpCalendar] = useState(false);
  const [showUsCalendar, setShowUsCalendar] = useState(false);
  const [conceptionDate, setConceptionDate] = useState(null);
  const [secondTrimester, setSecondTrimester] = useState(null);
  const [thirdTrimester, setThirdTrimester] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [EGA, setEGA] = useState("");

    const reset = () => {
      setUSweeks("");
      setUSdays("");
      setEGAweeks("");
      setEGAdays("");
      setLMP(new Date());
      setUSDate(new Date());
      setCycle(28);
      setShowLmpCalendar(false);
      setShowUsCalendar(false);
      setConceptionDate(null);
      setSecondTrimester(null);
      setThirdTrimester(null);
      setDueDate(null);
      setEGA("");
    };

    const calculateGestationalAge = (crlInMillimeters) => {
      const factor = 1.037;
      const adjustedCRL = crlInMillimeters * factor;
      const gestationalAge = Math.sqrt(adjustedCRL);
      return gestationalAge.toFixed(1); // Rounded to one decimal place
    }

    

    // Custom style for the modal
    const customStyles = {
      content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: 'fit-content',
          height: 'fit-content',
          minWidth: '300px', // Minimum width
          minHeight: '300px', // Minimum height
      }
    };
  
    // To set up modal styles
    Modal.setAppElement('#root');
  

    const handleInputChange = (event) => {
      const value = event.target.value;
      if (value >= 1 && value <= 84) {
        setCrl(value);
        const gestationalAgeWeeks = calculateGestationalAge(value);
        console.log(`Estimated gestational age: ${gestationalAgeWeeks} weeks`);
      }
    };

    useEffect(() => {
      const conception = new Date(LMP.getTime());
      conception.setDate(conception.getDate() + (cycle - 14)); // Corrected for ovulation
      setConceptionDate(conception);

      const second = new Date(conception.getTime());
      second.setDate(second.getDate() + 14 * 7);
      setSecondTrimester(second);

      const third = new Date(conception.getTime());
      third.setDate(third.getDate() + 28 * 7);
      setThirdTrimester(third);

      const due = new Date(conception.getTime());
      due.setDate(due.getDate() + 40 * 7);
      setDueDate(due);
    }, [LMP, cycle]);

    useEffect(() => {  // US is used when 5 days off from LMP dating.. 
      if (USweeks !== "" && USdays !== "") {
        const ultrasoundDate = new Date(USDate.getTime());
        ultrasoundDate.setDate(ultrasoundDate.getDate() + parseInt(USweeks) * 7 + parseInt(USdays));
        const diffDays = Math.abs((ultrasoundDate.getTime() - LMP.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 5) {
          setLMP(ultrasoundDate);
        }
      }
    }, [USweeks, USdays, USDate, LMP]);

    useEffect(() => {
      const today = new Date();
      const diffTime = Math.abs(today - LMP);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setEGA(Math.floor(diffDays/7) + " weeks and " + diffDays%7 + " days");
    }, [LMP]);

    useEffect(() => {
      if (EGAweeks !== "" && EGAdays !== "") {
        const today = new Date();
        const EGAdate = new Date(today.getTime());
        EGAdate.setDate(EGAdate.getDate() + parseInt(EGAweeks) * 7 + parseInt(EGAdays));
        setLMP(EGAdate);
      }
    }, [EGAweeks, EGAdays]);

    const computeFormulas = () => {
      // Replace these with the actual formulas
      const intergrowth = 40.9041 + 3.21585 / crl + 0.348956 * crl; // Updated formula
      const sahota = crl * 3; // Placeholder formula
      const verburg = crl * 4; // Placeholder formula
      const robinsons = crl * 5; // Placeholder formula

      return { intergrowth, sahota, verburg, robinsons };
    };

    const { intergrowth, sahota, verburg, robinsons } = computeFormulas();

    return (
      <>
        <div className="wrapper3">
          
          <form onSubmit={e => e.preventDefault()}>
            <h1>Crown-rump Length</h1>
              <p> The measurement between the top of the head to the area above where the legs begin.  </p>
  
            <div className="CRLinput">
              <h2 onClick={() => {setShowUsCalendar(!showUsCalendar); setShowLmpCalendar(false);}}>Crown-rump length: </h2>
              <Modal isOpen={showUsCalendar} onRequestClose={() => setShowUsCalendar(false)} style={customStyles}>
                <Calendar selected={USDate} onChange={(date) => {setUSDate(date); setShowUsCalendar(false);}} className="calendar mt-0" />
              </Modal>
              <input className='inp-CRL' type="number" value={crl} onChange={handleInputChange} />
           


            <h2>Intergrowth: {intergrowth}</h2>
            <h2>Sahota: {sahota}</h2>
            <h2>Verburg: {verburg}</h2>
            <h2>Robinsons: {robinsons}</h2>
          </div>

          <div className="input-US"> 
                        <h2 onClick={() => {setShowUsCalendar(!showUsCalendar); setShowLmpCalendar(false);}}>Ultrasound Date</h2>
                        <Modal isOpen={showUsCalendar} onRequestClose={() => setShowUsCalendar(false)} style={customStyles}>
                            <Calendar selected={USDate} onChange={(date) => {setUSDate(date); setShowUsCalendar(false);}} className="calendar mt-0" />
                        </Modal>

                    <div className="input-USweeks"> 
                        <h3>Week/s:</h3>
                        <input className="inp-usweeks" type="number" value={USweeks} onChange={e => setUSweeks(e.target.value)}></input>
                    </div>

                    <div className="input-USdays">
                        <h3>Day/s: </h3>
                        <input className="inp-usdays" type="number" value={USdays} onChange={e => setUSdays(e.target.value)}></input>
                    </div>
                </div>

            <div className='LMP1'>
                <h2 onClick={() => {setShowLmpCalendar(!showLmpCalendar); setShowUsCalendar(false);}}>Last Menstrual Period: 
                <Modal isOpen={showLmpCalendar} onRequestClose={() => setShowLmpCalendar(false)} style={customStyles}>
                    <Calendar selected={LMP} onChange={(date) => {setLMP(date); setShowLmpCalendar(false);}} className="calendar mt-0" />
                </Modal>
                {!showLmpCalendar && <span>{moment(LMP).format('MMMM Do YYYY')}</span>} {/* Display chosen date */}</h2>
            </div>

            <div className='Conception1'>
                    <h2>Conception Date: <span>{conceptionDate && conceptionDate.toDateString()}</span></h2>
                </div>

                <div className='SecondTrimester1'>
                    <h2>2nd Trimester Starts: <span>{secondTrimester && secondTrimester.toDateString()}</span></h2>
                </div>

                <div className='ThirdTrimester1'>
                    <h2>3rd Trimester Starts: <span>{thirdTrimester && thirdTrimester.toDateString()}</span></h2>
                </div>

                <div className='DueDate1'>
                    <h2>Estimated Due Date: <span>{dueDate && dueDate.toDateString()}</span></h2>
                </div>


                <div className='CycleLength-slider1'>
                    <h2>Cycle Length: {cycle} days</h2>
                    <input type="range" min="20" max="45" value={cycle} onChange={e => setCycle(e.target.value)} />
                </div>

                <div className='EGA1'>
                    <h2>Estimated Gestational Age: {EGA}</h2>
                    <div className="input-EGA">
                        <div className="input-EGAweeks"> 
                            <h3>Week/s:</h3>
                            <input className="inp-EGAweeks" type="number" value={EGAweeks} onChange={e => setEGAweeks(e.target.value)}></input>
                        </div>

                        <div className="input-EGAdays">
                            <h3>Day/s: </h3>
                            <input className="inp-EGAdays" type="number" value={EGAdays} onChange={e => setEGAdays(e.target.value)}></input>
                        </div>
                    </div>
                </div>

                <button className="resetBtn" onClick={reset}>Reset</button>
        </form>
      </div>
    </>
  );
};

export default PregnancyWheelCRL;
