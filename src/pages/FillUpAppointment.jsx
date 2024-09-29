import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './AppointmentForm.css'; 
import Navbar from '../Components/Global/Navbar_Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroudappointmentF from '../Components/Assets/FamilyPlanning_img2.jpg';

const AppointmentFillUp = () => {
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    email: "",
    age: "",
    appointmentType: "",
    date: "",
    time: "",
    message: "", // Add this line
  });

  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const firestore = getFirestore();
  const auth = getAuth();

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
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const appointmentData = {
        ...searchQuery,
      };

      console.log("Submitting appointment data:", appointmentData);
      const userId = auth.currentUser.uid;
      const userRef = doc(firestore, `users/${userId}`);
  
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        await updateDoc(userRef, {
          appointmentData: appointmentData,
          isApproved: false
        });
      } else {
        await setDoc(userRef, {
          appointmentData: appointmentData,
          isApproved: false,
        });
      }
  
      const appointmentsRef = collection(firestore, 'pendingAppointments');
      await addDoc(appointmentsRef, {
        ...appointmentData,
        isApproved: false,
        userId: userId
      });
  
      alert("Appointment scheduled successfully!");
      history.push({
        pathname: '/UserProfile',
        state: { appointmentData: appointmentData, action: 'update' }
      });
  
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="appointment-container">
        <div className="appointment-content">
          <div className="appointment-header">
            <h1>Make An Appointment</h1>
            <p>with St. Margaret Lying-in Clinic and take the first step towards a healthy and happy delivery.</p>
          </div>
          <div className="appointment-form">
            {submitted && Object.values(searchQuery).some(value => value === "") && (
              <p className="error-message">Please fill out all fields.</p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    className="form-control"
                    type="text"
                    name="name"
                    value={searchQuery.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="form-control"
                    type="email"
                    name="email"
                    value={searchQuery.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  className="form-control"
                  type="number"
                  name="age"
                  value={searchQuery.age}
                  onChange={handleChange}
                  autoComplete="age"
                />
              </div>
              <div className="form-group">
                <label htmlFor="appointmentType">Type of Appointment</label>
                <select
                  id="appointmentType"
                  className="form-control"
                  name="appointmentType"
                  value={searchQuery.appointmentType}
                  onChange={handleChange}
                >
                  <option value="">Select appointment type</option>
                  <option value="Prenatal Checkup">Prenatal Checkup</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="Postnatal Checkup">Postnatal Checkup</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  className="form-control"
                  type="time"
                  name="time"
                  value={searchQuery.time}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  className="form-control"
                  type="date"
                  name="date"
                  value={searchQuery.date}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Reason for Appointment / Additional Message</label>
                <textarea
                  id="message"
                  className="form-control"
                  name="message"
                  value={searchQuery.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Please provide any additional information or specific concerns"
                ></textarea>
              </div>
              <div className="form-group">
                <button type="submit" className="submit-btn" disabled={submitted && Object.values(searchQuery).some(value => value === "")}>
                  {submitted ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentFillUp;
