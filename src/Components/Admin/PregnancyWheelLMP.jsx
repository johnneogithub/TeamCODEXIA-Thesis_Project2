import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import Calendar from 'react-calendar';
import "./PregnancyWheelLMPStyle.css";


function PregnancyWheelLMP() {
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
    const [startDate, setStartDate] = useState(new Date());

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

    // Custom style for the modal
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '0%',
            transform: 'translate(-50%, -50%)',
            width: 'fit-content',
            height: 'fit-content',
            minWidth: '300px', // Minimum width
            minHeight: '300px', // Minimum height
        }
    };
    
    // To set up modal styles
    Modal.setAppElement('#root');

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

    useEffect(() => {  // Ultrasound is used when 5 days off from LMP dating.. 
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
            EGAdate.setDate(EGAdate.getDate() - (parseInt(EGAweeks) * 7 + parseInt(EGAdays))); // Correct: subtracting weeks and days
            setLMP(EGAdate); // Correct: setting LMP based on subtraction
        }
    }, [EGAweeks, EGAdays]);
    

    return (
        <>

        <div className="wrapper1">
            <form onSubmit={e => e.preventDefault()}>
                    <h1>Pregnancy Wheel</h1>
                    <p>This functions as wheel that represents the progression of pregnancy. </p>

                    <div className="input-US"> 
                        <h2 onClick={() => {setShowUsCalendar(!showUsCalendar); setShowLmpCalendar(false);}}>Ultrasound Date</h2>
                        <Modal isOpen={showUsCalendar} onRequestClose={() => setShowUsCalendar(false)} style={customStyles}>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => {setStartDate(date); setShowUsCalendar(false);}}
                                monthsShown={1}
                                showYearDropdown
                            />
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
    )
}

export default PregnancyWheelLMP;
