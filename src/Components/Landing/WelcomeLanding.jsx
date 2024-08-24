import React from 'react';
import BkgVideo from '../../Components/Assets/Happy_family3.mp4';
import '../../Components/Landing/WelcomeLandingStyle.css';
import { FaFacebook, FaBars } from 'react-icons/fa';
import Logo from '../../Components/Assets/PlantItFamIt_Logo.png';

const WelcomeLanding = () => {
  return (
    <>
        <nav>
          <div className="Wlogo">
            <img className="WPlanitfamitlogo" src={Logo} alt="PlanItFamIt Logo" />
            PlanItFamIt
          </div>
    
        <div className="nav-items">
            <li><a href="/Login">Login</a></li>
            <li><a href="/Register">Register</a></li>
            <li>
                <a href="https://www.facebook.com/your_facebook_page" target="_blank">
                    <FaFacebook size={30} />
                </a>
            </li>
        </div>
       <div className="cancel-icon">
          <span className="fas fa-times"></span>
        </div>
     </nav>

     <div className='overlay'>
      </div>
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
                opacity: .9, // Adjust the opacity value (0.0 to 1.0) to dim the video
              }}
            >
              <source src={BkgVideo} type="video/mp4" />
            </video>
          </div>


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

    </>
  )
}

export default WelcomeLanding;
