import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, setDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './searchbar.css';
import Navbar from '../Components/Global/Navbar_Main';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      setSubmitted(true);
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
  
      // Navigate to UserProfile and pass the new appointment data
      history.push({
        pathname: '/UserProfile',
        state: { appointmentData: searchQuery, action: 'update' }
      });
  
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  
  

  return (
    <>
      <Navbar />
      <div id="booking" className="section1">
        <div className="section-center">
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <div className="booking-cta">
                  <h1>Make An Appointment</h1>
                  <p> with St. Margaret Lying-in Clinic and take the first step towards a healthy and happy delivery.</p>
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
    </>
  );
};

export default AppointmentFillUp;
