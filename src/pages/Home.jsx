import './HomeStyle.css';
import newhome from '../Components/Assets/back-new1.png'
import Nav from '../Components/Global/Navbar_Main'
import { Link } from 'react-router-dom'
import Footer from '../Components/Global/Footer';

function Home() {
  return (
    <>
    <div className='background_home'>
      <Nav/>
      <div className='content_wrapper'>
        <div className='picture_fix'>
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
            <Link to="/Type" className='cta_button cta_button--tertiary'>Check your healthcare</Link>
          </div>    
        </div>
      </div>
    </div>
    <Footer/>
  </>
);
}

export default Home;