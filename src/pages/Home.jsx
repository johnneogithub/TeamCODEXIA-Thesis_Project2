import './HomeStyle.css';
import newhome from '../Components/Assets/back-new1.png';
import Nav from '../Components/Global/Navbar_Main';
import { Link } from 'react-router-dom';
import Footer from '../Components/Global/Footer';
import ProfileWarningModal from '../Components/Global/ProfileWarningModal';
import React, { useEffect, useState } from 'react';
import { checkUserProfileCompletion } from '../Config/firebase';
import { getAuth } from "firebase/auth"; // Import directly if not exported from firebase.js

function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.uid) {
          console.error("User is not authenticated or UID is undefined.");
          return;
        }

        // Check if the profile is complete
        const isProfileComplete = await checkUserProfileCompletion(user.uid);
        setShowModal(!isProfileComplete); // Only show modal if profile is incomplete
      } catch (error) {
        console.error("Error in profile completion check:", error);
      }
    };

    checkProfileCompletion();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className={`background_home ${showModal ? 'dimmed' : ''}`}>
        <Nav />
        <div className="content_wrapper">
          <div className="picture_fix">
            <img className="home_picture" src={newhome} alt="PlanitFamIt background" />
          </div>
          <div className="home_intro-style">
            <h1 className="main_title">Let us plan your future, for a better tomorrow.</h1>
            <p className="sub_title">PlanitFamIt is designed to reach every Filipino that seeks a better future for their family, through family planning.</p>
            
            <div className="cta_container">
              <Link to="/Chatbot" className="cta_button cta_button--primary">PlanIt Assistant</Link>
              <Link to="/Articles" className="cta_button cta_button--secondary">Healthcare Articles</Link>
            </div>

            <div className="healthcare_check">
              <Link to="/StMargaretLyingInClinic" className="cta_button cta_button--tertiary">Check your healthcare</Link>
            </div>    
          </div>
        </div>
      </div>
      
      {/* Profile Warning Modal */}
      <ProfileWarningModal show={showModal} onClose={handleCloseModal} />

      {/* Background dimming effect */}
      {showModal && <div className="modal-backdrop"></div>}

      <Footer />
    </>
  );
}

export default Home;
