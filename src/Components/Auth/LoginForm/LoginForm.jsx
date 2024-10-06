import "../LoginForm/LoginFormStyle.css";
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom'; // React Router's useHistory and Link hooks
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useAuth } from '../../../AuthContext';

import background1 from '../../Assets/landing_page_bkg1.png';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory();
  const auth = getAuth();
  const { loginAsUser } = useAuth();  // Use the auth context

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const SignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);

        // Call loginAsUser to set the user in the global auth state
        loginAsUser(user);

        // Store the remembered email if checkbox is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Redirect to home page after successful login
        history.push("/home");
      })
      .catch((error) => {
        console.error("Login error:", error.code, error.message);
        alert(`Login failed: ${error.message}`);
      });
  };

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5 mb-4 mb-md-0">
              <Link to="/Welcome">
                <img src={background1} className="img-fluid" alt="Log/Regis Illustration" />
              </Link>
            </div>

            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={SignIn} className="px-3 px-md-0">
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p className="lead fw-normal mb-4 me-2 text-center text-lg-start">Welcome, login to your account!</p>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="email" id="form3Example3" className="form-control form-control-lg"
                    placeholder="Enter a valid email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} />
                  <label className="form-label" htmlFor="form3Example3">Email address</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-3">
                  <input type="password" id="form3Example4" className="form-control form-control-lg"
                    placeholder="Enter password"  
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} />
                  <label className="form-label" htmlFor="form3Example4">Password</label>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3"
                      onChange={() => setRememberMe(!rememberMe)} checked={rememberMe} />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <a href="/Resetyourpassword" className="text-body">Forgot password?</a>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn-login w-100"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Login</button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="/Register"
                      className="link-danger">Register</a></p>
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
              <a href="https://www.facebook.com/people/Planitfamit/61559385112154/?viewas&show_switched_toast=false&show_switched_
                  tooltip=false&is_tour_dismissed=false&is_tour_completed=false&show_podcast_settings=false&show_community_review_
                  changes=false&should_open_composer=false&badge_type=NEW_MEMBER&show_community_rollback_toast=false&show_community_
                  rollback=false&show_follower_visibility_disclosure=false&bypass_exit_warning=true" className="text-white me-4" target="_blank" >
                <FaFacebookF/>
              </a>
              <a href="mailto:codexia.info@planitfamit.com" className="text-white me-4">
                <FaGoogle />
              </a>
            </div>
        </div>
      </section>
    </>
  );
}

export default LoginForm;
