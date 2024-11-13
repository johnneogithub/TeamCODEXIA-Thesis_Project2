import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './AppointmentForm.css'; 
import Navbar from '../Components/Global/Navbar_Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroudappointmentF from '../Components/Assets/FamilyPlanning_img2.jpg';
import { ToastContainer, toast } from 'react-toastify';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

const AppointmentFillUp = () => {
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    email: "",
    age: "",
    appointmentType: "",
    date: "",
    time: "",
    message: "",
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const firestore = getFirestore();
  const auth = getAuth();
  const [bookedTimes, setBookedTimes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
      toast.error("Please fill out all fields.");
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
  
      toast.success("Appointment scheduled successfully!");
      history.push({
        pathname: '/UserProfile',
        state: { appointmentData: appointmentData, action: 'update' }
      });
  
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  useEffect(() => {
    if (searchQuery.date) {
      fetchAvailableTimes(searchQuery.date);
    } else {
      setAvailableTimes([]); // Reset available times when no date is selected
    }
  }, [searchQuery.date]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const birthDate = new Date(userData.birthdate);
          
          // Calculate age from birthdate
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          // Update form with user data
          setSearchQuery(prevState => ({
            ...prevState,
            name: `${userData.firstName} ${userData.middleInitial ? userData.middleInitial + ' ' : ''}${userData.lastName}`,
            email: userData.email,
            age: age.toString()
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading user data");
      }
    };

    fetchUserData();
  }, [auth.currentUser, firestore]);

  const fetchAvailableTimes = async (date) => {
    try {
      const allTimes = generateTimeSlots();
      const booked = await getBookedTimes(date);
      const available = allTimes.filter(time => !booked.includes(time));
      console.log("Available times:", available);
      console.log("Booked times:", booked);
      setAvailableTimes(available);
      setBookedTimes(booked);
    } catch (error) {
      console.error("Error fetching available times:", error);
      setAvailableTimes([]);
      setBookedTimes([]);
    }
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 8; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const time = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        times.push(time);
      }
    }
    console.log("Generated time slots (12-hour format):", times); // Debug log
    return times;
  };

  const getBookedTimes = async (date) => {
    try {
      const firestore = getFirestore();
      const appointmentsRef = collection(firestore, 'pendingAppointments');
      const approvedAppointmentsRef = collection(firestore, 'approvedAppointments');
      
      const pendingQuery = query(appointmentsRef, where("date", "==", date));
      const approvedQuery = query(approvedAppointmentsRef, where("date", "==", date));
      
      const [pendingSnapshot, approvedSnapshot] = await Promise.all([
        getDocs(pendingQuery),
        getDocs(approvedQuery)
      ]);
      
      const pendingTimes = pendingSnapshot.docs.map(doc => doc.data().time);
      const approvedTimes = approvedSnapshot.docs.map(doc => doc.data().time);
      
      const bookedTimes = [...pendingTimes, ...approvedTimes];
      console.log("Booked times:", bookedTimes); // Debug log
      return bookedTimes;
    } catch (error) {
      console.error("Error getting booked times:", error);
      return []; // Return empty array in case of error
    }
  };
  
  const handleBookedTimeClick = (time) => {
    setAlertMessage(`The time ${time} is already booked. Please select another time.`);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
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
                    readOnly
                    placeholder="Enter your full name"
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
                    readOnly
                    placeholder="Enter your email address"
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
                  readOnly
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
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <div className="input-icon-wrapper">
                    <FaCalendarAlt className="input-icon" />
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
                </div>
                <div className="form-group">
                  <label htmlFor="time">Available Times</label>
                  <div className="input-icon-wrapper">
                    <FaClock className="input-icon" />
                    <select
                      id="time"
                      className="form-control"
                      name="time"
                      value={searchQuery.time}
                      onChange={handleChange}
                      disabled={!searchQuery.date}
                    >
                      <option value="">Select an available time</option>
                      {availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No available times for this date</option>
                      )}
                    </select>
                  </div>
                </div>
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
              {/* New section to display booked times */}
              {bookedTimes.length > 0 && (
                <div className="booked-times">
                  <h3>Already Booked Times</h3>
                  <ul className="booked-times-list">
                    {bookedTimes.map((time, index) => (
                      <li 
                        key={index} 
                        onClick={() => handleBookedTimeClick(time)}
                      >
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AppointmentFillUp;
