import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './searchbar.css';
import DashboardAdmin from '../Components/Admin/DashboardAdmin';
import Navbar from '../Components/Global/Navbar_Main';
import familyappointment from '../Components/Assets/family.png';
import 'bootstrap/dist/css/bootstrap.min.css'

const AppointmentFillUp = () => {
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    email: "",
    age: "",
    appointmentType: "",
    date: "",
    time: ""
  });

  const [appointmentSet, setAppointmentSet] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const firestore = getFirestore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const isEmpty = Object.values(searchQuery).some(value => value === "");
    if (isEmpty) {
      setSubmitted(true);
      return;
    }
    try {
      await addSearchQuery(searchQuery);
      history.push({
        // pathname: '/UserProfile',
        state: { appointmentData: searchQuery }
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const addSearchQuery = async (searchQuery) => {
    try {
      const docRef = await addDoc(collection(firestore, 'searchQueries'), searchQuery);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };

  return (
    <>
    <Navbar/>
    <div id="booking" className="section">
   
    <div className="section-center">
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="booking-cta">
              <h1>Make An Appointment</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Cupiditate laboriosam numquam at
              </p>
            </div>
          </div>
          <div className="col-md-6 col-md-offset-1">
            <div className="booking-form">
            {submitted && Object.values(searchQuery).some(value => value === "") && (
            <p className="error-message">Please fill out all fields.</p>
          )}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input className="form-control"
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={searchQuery.name}
                        onChange={handleChange}
                        autoComplete="name"
                      />
                      {/* <span className="form-label">Name</span> */}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input className="form-control" 
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={searchQuery.email}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  {/* </div> */}
                {/* <div className="row"> */}
                  <div className="col-md-6">
                    <div className="form-group">
                    <input className="form-control"
                        type="number"
                        placeholder="Age"
                        name="age"
                        value={searchQuery.age}
                        onChange={handleChange}
                        autoComplete="age"
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                    <input className="form-control"
                    type="text"
                    placeholder="Type of Appointment"
                    name="appointmentType"
                    value={searchQuery.appointmentType}
                    onChange={handleChange}
                    autoComplete="off"
                     />
                    </div>
                    </div>
                    </div>
                  {/* <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <span className="form-label">Guests</span>
                      <select className="form-control">
                        <option>1 Person</option>
                        <option>2 People</option>
                        <option>3 People</option>
                      </select>
                      <span className="select-arrow" />
                    </div>
                  </div> */}
  
                
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                    <input className="form-control"
                    type="time"
                    placeholder="Time"
                    name="time"
                    value={searchQuery.time}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                         {/* <span className="form-label">Time</span> */}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                    <input className="form-control"
                      type="date"
                      placeholder="Date"
                      name="date"
                      value={searchQuery.date}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                      {/* <span className="form-label">Date</span> */}
                    </div>
                  </div>
                </div>
                <div className="form-btn">
                  <button type="submit" className="submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
      {appointmentSet && (
        <div className="popup">
          <div className="popup-inner">
            <p>Appointment set successfully!</p>
            <button onClick={() => setAppointmentSet(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentFillUp;
