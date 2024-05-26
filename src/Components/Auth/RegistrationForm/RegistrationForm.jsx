import React, { useState } from "react";
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaGoogle   } from "react-icons/fa";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../../Config/firebase";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";


import background1 from '../../Assets/landing_page_bkg1.png'
import background2 from '../../Assets/landing_page_bkg2.png'

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const SignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!agreedToTerms) {
      openModal();
      return;
    }

    const auth = getAuth(); // Get the auth instance

    try {
      // Check if the email is already registered
      const existingUser = await fetchSignInMethodsForEmail(auth, email);
      if (existingUser.length > 0) {
        alert("This email is already registered. Please use a different email.");
        return;
      }

      // Register the user
      await createUserWithEmailAndPassword(auth, email, password);
      // User registered successfully
      setRegistrationSuccess(true);
      setTimeout(() => {
        history.push("/Login"); // Redirect to login page after a delay
      }, 2000); // Wait for 2 seconds before redirecting
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
        width: '40%', // Adjust the width of the modal
        height: '85%', // Adjust the height of the modal
        margin: 'auto', // Center the modal
        },
      }}>
  
      <section class="flex_center">
        <div class="tc_main">
          <div class="tc_content">
            <div class="tc_top">
              <div class="icon">
                <i class="fa-solid fa-clipboard"></i>
              </div>
              <div class="title">
                <p>Data Privacy Act of 2012</p>
              </div>
              <div class="info">
              In compliance with the Data Privacy Act of 2012 in the Philippines, the website application is committed to safeguarding the personal information of the users. Adhering to the principles of transparency, legitimate purpose, and proportionality as 
              mandated by the Act. Implementing robust organizational, physical, and technical security measures to protect personal data against unauthorized access, alteration, and disclosure. 
              <br/> Furthermore, respecting the rights of data subjects by providing mechanisms for data access, correction, and erasure as stipulated in 
              the Act. The commitment to data privacy is unwavering, and continuously monitoring the practices to align with the National Privacy Commission's standards and regulations.
              </div>
            </div>
            <div class="tc_bottom">
              <div class="title">
                <p>Terms and Conditions</p>
              </div>
              <div class="info">
                <p> 1. Purpose and Scope
                    <br/> The PlantItFamIt application ("the App") provides family planning services, appointment scheduling, chatbot assistance, and menstrual cycle tracking.
                    By using the App, patients agree to comply with these terms and conditions. </p>

                <p> 2. Data Privacy and Security
                    <br/> We adhere to the Data Privacy Act of 2012 in the Philippines.
                    Patient data is collected for specified and legitimate purposes only.
                    Personal information is processed fairly, lawfully, and retained as necessary.
                    Robust security measures protect against unauthorized access, alteration, and disclosure.</p>

                <p> 3. User Responsibilities
                    <br/> Patients must use the App responsibly and follow guidelines. 
                    Any misuse or violation may result in account suspension or legal action.</p>

                <p> 4. Intellectual Property  Rights
                    <br/> The App and its content are protected by intellectual property rights laws.  
                    Users may not copy, distribute, or modify the software without written permission from the developer.
                    Users may not modify, adapt, translate, or create derivative works from any part of the App without explicit permission from the owners of such
                    Unauthorized copying, distribution, modification, or sale of any part of the App  
                    is strictly prohibited. </p>

                <p> 5. Disclaimers and Warranties
                  <br/> We provide accurate information, but users should consult healthcare professionals for personalized advice.
                  The App does not guarantee specific outcomes or results.</p>

                <p> 6. Access and Amendments
                    <br/> Patients can access, correct, or request erasure of their data.
                    Contact our support team for assistance.</p>

                <p> By using the PlantItFamIt application, patients acknowledge and accept these terms and conditions.</p>
              </div>
            </div>
          </div>
          <div class="tc_btns">
          <button className={'accept'} onClick={closeModal}>Agree and Close</button>
          </div>
        </div>
      </section>
      
      </Modal>


    <section className="vh-100">
            <div className="container-fluid h-custom">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-md-9 col-lg-6 col-xl-5">
                  <img src={ background1 }
                    className="img-fluid" alt="Log/Regis Illustration"></img>
                </div>
                
                <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <form onSubmit={SignUp}>
                    <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                      <p className="lead fw-normal mb-0 me-3">Register with</p>
                      <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-floating mx-1" style={{backgroundColor: '#c825da'}}>
                          <FaFacebookF style={{color: 'white'}} />
                      </button>

                      <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-floating mx-1" style={{backgroundColor: '#c825da'}}>
                        <FaTwitter style={{color: 'white'}} />
                      </button>
                    </div>


                    <div className="divider d-flex align-items-center my-4">
                      <p className="text-center fw-bold mx-3 mb-0">Or</p>
                    </div>


                    <div data-mdb-input-init className="form-outline mb-8">
                      <input type="email" id="form3Example3" className="form-control form-control-lg"
                        placeholder="Enter a valid email address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}/>
                      <label className="form-label" for="form3Example3">Email address</label>
                    </div>


                    <div data-mdb-input-init className="form-outline mb-3">
                      <input type="password" id="form3Example4" className="form-control form-control-lg"
                        placeholder="Enter password"  
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                      <label className="form-label" for="form3Example4">Password</label>
                    </div>

                    <div data-mdb-input-init className="form-outline mb-3">
                      <input type="password" id="form3Example4cp" className="form-control form-control-lg"
                        placeholder="Please, confirm your password"  
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                      <label className="form-label" for="form3Example4cp">Confirm your password</label>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check mb-0">
                      <input 
                          className="form-check-input me-2" 
                          type="checkbox" 
                          id="form2Example3" 
                          checked={agreedToTerms} 
                          onChange={() => setAgreedToTerms(!agreedToTerms)}
                      />
                      <label className="form-check-label" htmlFor="form2Example3">
                          <a href="#" onClick={openModal}>Terms and Conditions</a>
                      </label>
                  </div>

                      <a href="/Resetyourpassword" className="text-body">Forgot password?</a>
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn-login "
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Register Now!</button>
                      <p className="small fw-bold mt-2 pt-1 mb-0" style={{ paddingBottom: '1.5rem' }}>Already have an account? <a href="/Login"
                          className="link-danger">Login</a></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            
            
            <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-2 px-xl-5 bg-fotlogin">

              <div className="text-white mb-3 mb-md-0">
                Copyright © 2024 PlanItFamIt. All rights reserved. 
              </div>

              <div>
                <a href="#!" className="text-white me-4">
                  <FaFacebookF/>
                </a>
                <a href="#!" className="text-white me-4">
                  <FaTwitter/>
                </a>
                <a href="#!" className="text-white me-4">
                  <FaGoogle />
                </a>
              </div>

            </div>
          </section>
    
          {registrationSuccess && <p style={{ color: 'green' }}>Successfully registered! You can now log in.</p>}

  </>  
  );
};

export default RegistrationForm;