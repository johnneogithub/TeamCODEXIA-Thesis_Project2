import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "../TabView/PregnancyWheelIVFStyle.css";
import moment from 'moment';
import Modal from 'react-modal';


// Children 2: In Virto Fertilization
// Hierachy: three children (components), 1 parent, & 1  grandparent 


function PregnancyWheelIVF() {
    const [IVFdays, setIVFdays] = useState("");
    const [LMP, setLMP] = useState(new Date());
    const [EGAweeks, setEGAweeks] = useState("");
    const [EGAdays, setEGAdays] = useState("");
    const [cycle, setCycle] = useState(28);
    const [showLmpCalendar, setShowLmpCalendar] = useState(false);
    const [showUsCalendar, setShowUsCalendar] = useState(false);
    const [conceptionDate, setConceptionDate] = useState(null);
    const [secondTrimester, setSecondTrimester] = useState(null);
    const [thirdTrimester, setThirdTrimester] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [EGA, setEGA] = useState("");

    const reset = () => {
        setEGAweeks("");
        setEGAdays("");
        setLMP(new Date());
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

    useEffect(() => {
        const conception = new Date(LMP.getTime());
        conception.setDate(conception.getDate() + (cycle - 14) + parseInt(IVFdays)); // Adjusted for IVF
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
    }, [LMP, cycle, IVFdays]); // Added IVFdays to the dependency array

    useEffect(() => {
        const today = new Date();
        const diffTime = Math.abs(today - LMP);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        setEGA(Math.floor(diffDays/7) + " weeks and " + diffDays%7 + " days");
    }, [LMP]);

    return (
        <>

        <div className="wrapper2">
        <form onSubmit={e => e.preventDefault()}>
                <h1>In-Vitro Fertilization</h1>
                <p>A process of fertilisation where an egg is combined with sperm in vitro.  </p>

                <div className='LMP1'>
                <h2 onClick={() => {setShowLmpCalendar(!showLmpCalendar); setShowUsCalendar(false);}}>Last Menstrual Period: 
                <Modal isOpen={showLmpCalendar} onRequestClose={() => setShowLmpCalendar(false)} style={customStyles}>
                    <Calendar selected={LMP} onChange={(date) => {setLMP(date); setShowLmpCalendar(false);}} className="calendar mt-0" />
                </Modal>
                {!showLmpCalendar && <span>{moment(LMP).format('MMMM Do YYYY')}</span>} {/* Display chosen date */}</h2>
            </div>

            <div className='IVF1'>
                <h2>IVF Embryo Age (1-9 days):</h2>
                <input className="inp-IVF" type="number" min="1" max="9" value={IVFdays} onChange={e => setIVFdays(e.target.value)}></input>
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

export default PregnancyWheelIVF;
