import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import BkgVideo from '../../Components/Assets/Happy_family2.mp4';
import '../../Components/Landing/WelcomeLandingStyle.css';
import { FaFacebook } from 'react-icons/fa';
import Logo from '../../Components/Assets/PlantItFamIt_Logo.png';

const WelcomeLanding = () => {
  const [pageViews, setPageViews] = useState(null);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/page-views', {
          params: { pagePath: window.location.pathname },
        });
        setPageViews(response.data.pageViews);
      } catch (error) {
        console.error('Error fetching page views:', error);
        setPageViews('Error');
      }
    };

    fetchPageViews();
  }, []);

  return (
    <>
      <nav className='nav-container-WL'>
        <div className="Wlogo">
          <img className="WPlanitfamitlogo" src={Logo} alt="PlanItFamIt Logo" />
          <span>PlanItFamIt</span>
        </div>
        <div className="nav-items desktop-nav">
          <li className='login-style-css-WL'><a href="/Login">Login</a></li>
          <li className='register-style-css-WL'><a href="/Register">Register</a></li>
          <li>
            <a href="https://www.facebook.com/share/RhhfyxArwqdyi5cW/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} />
            </a>
          </li>
        </div>
      </nav>

      <div className='overlay textured-bg'></div>
      <div className='videobg'>
        <video autoPlay loop muted
          style={{
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-2",
            opacity: .9,
          }}
        >
          <source src={BkgVideo} type="video/mp4" />
        </video>
      </div>

      <main>
        <div className='WelcomemsgHEAD'>
          <h1>Plan Today</h1>
          <h2>for a happier tomorrow</h2>
          <p> Welcome to PlanItFamIt! In partnership with St. Margaret Lying In Clinic, we offer premier 
          <br/> family planning services. Our platform features comprehensive planning tools, an 
          <br/> AI chatbot assistant, and seamless appointment scheduling to enhance your experience. 
          <br/> Start planning your family's future with us today.
          </p>
          <h3> "PlanItFamIt, your guide to family planning!"</h3>
        </div>
        <div className="mobile-nav">
          <a href="/Login" className="mobile-nav-button">Login</a>
          <a href="/Register" className="mobile-nav-button">Register</a>
        </div>
      </main>

      <Footer />
    </>
  )
}

const Footer = () => {
  return (
    <footer className='footerers-WL'>
      <div className="foot_container">
        <p>Page Views: <span id="page-views">Loading...</span></p>
      </div>
    </footer>
  );
}

export default WelcomeLanding;
