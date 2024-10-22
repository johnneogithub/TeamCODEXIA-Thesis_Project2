import React, { useState } from "react";
import { FaFacebookF, FaEnvelope } from "react-icons/fa";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../Config/firebase";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import DatePicker from "react-datepicker"; // Import date picker
import "react-datepicker/dist/react-datepicker.css"; // Datepicker CSS

import { getFirestore, doc, runTransaction } from "firebase/firestore";
import background1 from '../../Assets/landing_page_bkg1.png';

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(null); // Store birthdate
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const history = useHistory();

  const openModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setAgreedToTerms(true);
    setModalIsOpen(false);
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const SignUp = async (e) => {
    e.preventDefault();

    // Check if the birthdate is provided
    if (!birthdate) {
      alert("Please select your birthdate.");
      return;
    }

    // Validate if the user is 20 years old or older
    const age = calculateAge(birthdate);
    if (age < 20) {
      console.error("User is under 20 years old. Registration not allowed.");
      alert("You must be 20 years or older to register.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!agreedToTerms) {
      openModal();
      return;
    }

    const auth = getAuth();
    const firestore = getFirestore();

    try {
      const existingUser = await fetchSignInMethodsForEmail(auth, email);
      if (existingUser.length > 0) {
        alert("This email is already registered. Please use a different email.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      alert("A verification email has been sent. Please verify your email before logging in.");

      const userCountRef = doc(firestore, 'statistics', 'userCount');
      await runTransaction(firestore, async (transaction) => {
        const userCountDoc = await transaction.get(userCountRef);
        if (!userCountDoc.exists()) {
          transaction.set(userCountRef, { count: 1 });
        } else {
          const newCount = userCountDoc.data().count + 1;
          transaction.update(userCountRef, { count: newCount });
        }
      });

      setRegistrationSuccess(true);
      setTimeout(() => {
        history.push("/Login");
      }, 2000);
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Terms and Conditions"
        style={{
          content: {
            width: '40%',
            height: '85%',
            margin: 'auto',
          },
        }}>
        <section className="flex_center">
          <button className="accept" onClick={closeModal}>Agree and Close</button>
        </section>
      </Modal>

      <div className="registration-section">
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src={background1} className="img-fluid" alt="Log/Regis Illustration" />
            </div>

            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={SignUp} className="registration-form">
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p className="lead fw-normal mb-3 me-3">Register with us!</p>
                </div>

                {/* Email */}
                <div className="form-outline mb-8">
                  <label className="form-label">Email address</label>
                  <input type="email" className="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </div>

                {/* Name Fields in One Row */}
                <div className="d-flex justify-content-between mb-3">
                  <div className="form-outline me-2">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control form-control-lg"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="form-outline me-2">
                    <label className="form-label">Middle Initial</label>
                    <input type="text" className="form-control form-control-lg"
                      placeholder="M.I. (Optional)"
                      value={middleInitial}
                      onChange={(e) => setMiddleInitial(e.target.value)} />
                  </div>
                  <div className="form-outline">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control form-control-lg"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                {/* Birthdate (Calendar Modal) */}
                <div className="form-outline mb-3">
                  <label className="form-label">Birthdate</label>
                  <DatePicker
                    selected={birthdate}
                    onChange={(date) => setBirthdate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control form-control-lg"
                    placeholderText="Select your birthdate"
                  />
                </div>

                {/* Password */}
                <div className="form-outline mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                </div>

                {/* Confirm Password */}
                <div className="form-outline mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control form-control-lg"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                {/* Agree to Terms */}
                <div className="form-check mb-0">
                  <input className="form-check-input me-2" type="checkbox"
                    checked={agreedToTerms}
                    onChange={() => setAgreedToTerms(!agreedToTerms)} />
                  <label className="form-check-label" htmlFor="form2Example3">
                    <a href="#" onClick={openModal}>Terms and Conditions</a>
                  </label>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="submit" className="btn-login"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Register Now!</button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="/Login"
                      className="link-danger">Login</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <footer className="footer-register bg-fotregister mt-auto">
          <div className="footer-content-register">
            <div className="text-white">
              Copyright © 2024 PlanItFamIt. All rights reserved. 
            </div>

            <div>
              <a href="https://www.facebook.com" className="text-white me-4" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="mailto:codexia.info@planitfamit.com" className="text-white me-4">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {registrationSuccess && <p style={{ color: 'green' }}>Successfully registered! Please check your email to verify your account.</p>}
    </>
  );
}

export default RegistrationForm;
