import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, setDoc} from 'firebase/firestore';
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
    time: ""
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
      console.log("Submitting appointment data:", searchQuery);
      const userId = auth.currentUser.uid; // Get the current user ID
      const userRef = doc(firestore, `users/${userId}`);
  
      // Check if the document exists
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(userRef, {
          appointmentData: searchQuery,
          isApproved: false
        });
      } else {
        // Document does not exist, create it
        await setDoc(userRef, {
          appointmentData: searchQuery,
          isApproved: false,
          // You can add more fields here if needed
        });
      }
  
      // Add the appointment to the 'pendingAppointments' collection
      const appointmentsRef = collection(firestore, 'pendingAppointments');
      await addDoc(appointmentsRef, {
        ...searchQuery,
        isApproved: false,
        userId: userId // Optionally store the user ID for reference
      });
  
      alert("Appointment scheduled successfully!");
      history.push({
        pathname: '/UserProfile',
        state: { appointmentData: searchQuery, action: 'update' }
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
