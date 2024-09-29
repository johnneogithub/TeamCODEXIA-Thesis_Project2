import React from 'react';
import './Aboutus.css';
import Navbar from '../Components/Global/Navbar_Main';
import neo from "../images/neo_pic.jpg"
import dom from "../images/dom_pic.jpg"
import glor from "../images/glor_pic.jpg"
import sherwin from "../images/sherwin.jpg"

const Aboutus = () => {
  const teamMembers = [
    {
      name: "John Neo Lopez",
      role: "Visionary Leader",
      description: "John Neo's commitment to family planning stems from his research on teenage pregnancy rates. His expertise in machine learning and AI has been crucial in developing PlanItFamIt's revolutionary features.",
      image: neo
    },
    {
      name: "Dominique Robles",
      role: "Design Expert",
      description: "Dominique has created a visually appealing and user-friendly platform. Her focus on accessibility ensures that PlanItFamIt is a pleasure to use for all.",
      image: dom
    },
    {
      name: "John Ray Gloria",
      role: "Tech Genius",
      description: "John Ray ensures the platform runs smoothly and responds quickly. His backend development skills have been crucial in establishing a reliable and effective user interface.",
      image: glor
    },
    {
      name: "Mr. Sherwin Rhey Condez",
      role: "Mentor and Advisor",
      description: "Mr. Condez has provided invaluable guidance throughout the development process. His extensive experience has been instrumental in shaping PlanItFamIt.",
      image: sherwin
    }
  ];

  return (
    <>
    <Navbar />
    <div className="about-us-container">
      <header className="about-header">
        <div className="header-content-about">
          <h1>About PlanItFamIt</h1>
          <p className="tagline">Empowering Reproductive Health Decisions</p>
        </div>
      </header>
      
      <main className="about-content">
        <section className="mission-vision">
          <div className="section-content">
            {/* <h2 className="section-title">Our Mission & Vision</h2> */}
            <div className="mission-vision-content">
              <div className="mission">
                <h3>Our Mission</h3>
                <p>PlanItFamIt bridges the gap between individuals and essential family planning services. We provide a user-friendly platform that connects people with qualified healthcare professionals, offers reliable information, and empowers them to take control of their reproductive choices.</p>
              </div>
              <div className="vision">
                <h3>Our Vision</h3>
                <p>We envision a future where everyone has access to affordable, accessible, and comprehensive family planning care. PlanItFamIt is committed to breaking down barriers, promoting reproductive health, and fostering a society where individuals can thrive.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="history">
          <div className="section-content">
            <h2 className="section-title">Our Journey</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-content">
                  <h3>August 2023</h3>
                  <p>PlanItFamIt is developed as a tool to help the barangays of Olongapo City.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-content">
                  <h3>2024</h3>
                  <p>PlanItFamIt grows into a comprehensive platform supporting family planning clinics such as St. Margaret Lying In Clinic.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="team">
          <div className="section-content">
            <h2 className="section-title">Meet the Team</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="member-image" 
                    onError={(e) => {
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-description">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="partnership">
          <div className="section-content">
            <h2 className="section-title">Proud Partnership with Gordon College</h2>
            <p>PlanItFamIt is a testament to the innovative spirit and commitment to social justice fostered by Gordon College. We are proud to represent the university and its dedication to equipping students with the tools to change the world.</p>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Join the Revolution</h2>
            <p className="cta-description">Together, we can transform family planning and create a brighter future for all.</p>
            <button className="cta-button">Get Involved</button>
          </div>
          <div className="cta-image">
            <img 
              src="https://via.placeholder.com/500x300?text=Family+Planning+Revolution" 
              alt="Family planning revolution" 
              className="cta-img"
            />
          </div>
        </section>
      </main>
    </div>
    </>
  );
};

export default Aboutus;