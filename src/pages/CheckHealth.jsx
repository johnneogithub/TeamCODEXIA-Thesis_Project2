import React from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

//Styles
import './CheckHealthStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css'

//Global
import Navbar from '../Components/Global/Navbar_Main';
import Footer from '../Components/Global/Footer';

import Cover from '../Components/Assets/type-user.png';

const Type = (props) => {
    const history = useHistory();

    const handleAppointmentClick = () => {
      history.push('/FillUpAppointment'); 
    };

      return (
    <>
    <Navbar/>

      {/* header close */}
      {/* Slider Start */}
        <section className="slider">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="block">
                  <h1 className="animated fadeInUp">
                  St. Margaret Lying In Clinic
                  </h1>
                  {/* <p className="animated fadeInUp">
                    We love the Web and the work we do.We work closely with our
                    clients to deliver <br /> the best possible solutions for their
                    needs
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      {/* Wrapper Start */}
        <section className="about section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <div className="block">
                  <div className="section-title">
                    <h2> Welcome to St. Margaret Lying In Clinic!</h2>
                    <p>
                    We are thrilled to be a part of your journey through the miracle of life. 
                  As a dedicated pregnancy care center, we are committed to providing comprehensive and compassionate care. 
                  Partnered with the innovative family planning application, PlanItFamIt, we aim to empower and support you in every step 
                  of your family planning journey. Together, let's celebrate the joy of parenthood!
                    </p>
                  </div>
                {/* <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt mollit anim id{" "}
                </p> */}
              </div>
            </div>
            {/* .col-md-7 close */}
            <div className="col-md-5">
              <div className="block">
                <img src={Cover} alt="Img" />
              </div>
            </div>
            {/* .col-md-5 close */}
          </div>
        </div>
      </section>
      <section className="feature bg-2">
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-md-6">
              <h2 className="section-subtitle">Embark on Your Journey: Convenient Online Appointments at St. Margaret's</h2>
              <p>
              Welcome to motherhood and beyond at St. Margaret's Lying-In Clinic. Our dedicated staff is here to support
              your exciting journey, from family planning consultations to postpartum care for your precious newborn. 
              Schedule your appointment online today for a convenient time that fits your busy schedule.  We offer online
                booking during our regular clinic hours, making it simple and secure to plan your visit from the comfort of your
                home. We're excited to be a part of your story.
              </p>
              <a className="btn btn-view-works" onClick={handleAppointmentClick}>
                Appointment
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Service Start */}
      <section className="service">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="section-title">
                <h2>Services</h2>
                <p>
                In order to meet the specific requirements of pregnant women, babies, 
                and their families, St. Margaret Lying-In Clinic provides outstanding
                maternity and newborn care in a caring setting. This ensures a secure and supportive experience from conception to postpartum recovery.
                </p>
              </div>
            </div>
          </div>
          <div className="row  ">
            <div className="col-lg-3 col-md-3 col-sm-3  mx-auto">
              <div className="service-item">
                <i className="icon ion-coffee" />
                <i class="bi bi-bandaid"></i>
                <p>
                MATERNITY PACKAGE (RM)<br/>
                MATERNITY PACKAGE (OB)<br/>
                NSD PACKAGE (RM)<br/>
                NSD PACKAGE (OB)<br/>
                NEWBORN CARE PACKAGE(RM)<br/>
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3 mx-auto">
              <div className="service-item">
                <i className="ion-compass" />
                {/* <h4>Web Design</h4> */}
                <i class="bi bi-heart-pulse"></i> 
                <p>
                NEWBORN CARE PACKAGE (OB)<br/>
                FAMILY PLANNING CONSULT<br/>
                PRENATAL CONSULTATION<br/>
                POSTNATAL CONSULTATION<br/>
                NEWBORN SCREENING<br/>
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3  mx-auto">
              <div className="service-item">
                <i className="ion-image" />
                <i class="bi bi-bandaid"></i>
                <p>
                NEWBORN HEARING SCREENING<br/>
                PAP-SMEAR<br/>
                NON-STRESS TEST<br/>
                EAR PIERCING<br/>
                INTERNAL EXAMINATION<br/>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to action Start */}
      <section className="call-to-action bg-1 section-sm overly">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="block">
                <h2 className="mb-3">OUR LOCATION OUR LOCATION</h2>
                <p>
                We extend a warm welcome to you at our clinic located at GF 74A 20th St., East Bajac Bajac, Olongapo,
                Philippines. Our dedicated team is here to provide quality maternal and
                  child care services. Whether you’re expecting or need postnatal support, 
                  we’re committed to your well-being. Feel free to explore our facilities 
                  and resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Content Start */}
      <section className="testimonial">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center">
                <h2>About</h2>
                <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt debitis dolore nulla sint
                tempore ducimus. Delectus vel ratione
                animi eligendi magni. Id saepe unde quisquam quae esse eum dignissimos in.
                </p>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
      
            <div className="col-md-5 col-md-offset-1 mx-auto">
              <div className="testimonial-carousel text-center">
                <div className="testimonial-slider owl-carousel">
                  <div>
                    <i className="ion-quote" />
                    <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid nulla quasi cumque error minus ex quidem vitae quae non, omnis molestiae
                      corrupti architecto commodi inventore illum necessitatibus ipsum atque aut?
                    </p>
                    <div className="user">
                      <img src="images/item-img1.jpg" alt="tao" />
                      <p>
                      <span>  Lorem ipsum,y</span>   Lorem ipsum,
                      </p>
                    </div>
                  </div>
                  <div>
                    <i className="ion-quote" />
                    <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid nulla quasi cumque error minus ex quidem vitae quae non, omnis molestiae
                      corrupti architecto commodi inventore illum necessitatibus ipsum atque aut?
                    </p>
                    <div className="user">
                      <img src="images/item-img1.jpg" alt="tao" />
                      <p>
                        <span>  Lorem ipsum,y</span>   Lorem ipsum,
                      </p>
                    </div>
                  </div>
                  <div>
                    <i className="ion-quote" />
                    <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid nulla quasi cumque error minus ex quidem vitae quae non, omnis molestiae
                      corrupti architecto commodi inventore illum necessitatibus ipsum atque aut?
                    </p>
                    <div className="user">
                      <img src="images/item-img1.jpg" alt="tao" />
                      <p>
                        <span>  Lorem ipsum,</span>  Lorem ipsum,
                      </p>
                    </div>
                  </div>
                  <div>
                    <i className="ion-quote" />
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid nulla quasi cumque error minus ex quidem vitae quae non, omnis molestiae
                      corrupti architecto commodi inventore illum necessitatibus ipsum atque aut?
                    </p>
                    <div className="user">
                      <img src="images/item-img1.jpg" alt="tao" />
                      <p>
                      <span>  Lorem ipsum,</span>  Lorem ipsum,
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>

  );
};

export default Type;