import React from 'react';
import BkgVideo from '../../Components/Assets/Happy_family.mp4';
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
            zIndex: "-1",
            opacity: 0.9 // Adjust the opacity value (0.0 to 1.0) to dim the video
          }}
        >
          <source src={BkgVideo} type="video/mp4" />
        </video>
      </div>


      <div className='WelcomemsgHEAD'>
        <h1>Family Planning at your reach!</h1>
        <p> PlanItFamIt revolutionizes the approach to family planning, making it easier than ever. 
          <br/>We are proud to partner with St. Margaret Lying In Clinic to provide top-tier services tailored to your family's needs.
          <br/>Indulge in the various features we offer, designed to simplify and enhance your family planning experience. 
          <br/>From comprehensive family planning tools to an AI chatbot assistant ready to guide you, PlanItFamIt is equipped to handle it all.
          <br/>Our appointment scheduling feature ensures you never miss an important event or meeting.
        </p>
        <h2> "PlanItFamIt, your guide to family planning!"</h2>
      </div>

    </>
  )
}

export default WelcomeLanding;
