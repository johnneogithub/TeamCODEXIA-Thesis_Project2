// import React, { useState } from "react"
import "../Global/Navbar_LandingStyle.css"
import { Link } from "react-router-dom"
// import { FaBars } from "react-icons/fa"
// import { ImCross } from "react-icons/im"

// import background1 from '../../Components/Assets/landing_page_bkg1.png';
// import background2 from '../../Components/Assets/landing_page_bkg2.png';
import humber from '../Assets/hamburger.png'


const Navbar = () => {
  // const [Mobile, setMobile] = useState(false)
  return (
    <>


<nav className='navbar-landing-page'>
  <input type="checkbox" id="check" />
  <label for="check" className="checkbtn">
    <i><img src={humber} alt="" /></i>
  </label>

 <label  className="landing-nav">PlanIt<span>FamIt</span></label>
  <ul>
  <Link to="/Login"> 
    <li>
      <a>Login</a>
    </li>
  </Link> 
  <Link to="/About"> 
    <li>
      <a>About</a>
    </li>
  </Link> 
  </ul>
</nav>

      {/* <div className="landingpagebkg">
        <div className="flex-landingbkg1">
          <img src={background1} alt="background1"  />
          </div>
        <div className="flex-landingbkg2" >
          <img src={background2} alt="background2" />
        </div>
    </div> */}

    
</>
  )
}
export default Navbar;