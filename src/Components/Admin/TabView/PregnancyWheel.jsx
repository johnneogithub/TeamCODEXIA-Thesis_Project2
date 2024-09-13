import React from "react";
import "../TabView/PregnancyWheelStyle.css";

import Sidebar from '../../Global/Sidebar';
import PregnancyWheelTAB from './PregnancyWheelTAB.jsx';
import { Link } from 'react-router-dom';

import Clinic from '../../Assets/stmargaretlogo.png'
import logomini from '../../Assets/logo-mini.svg'
import Circle from '../../Assets/circle.png'

// Grandparent (Highest in the hierarchy)
// This is the PregnancyWheel found in the routing..
// Hierachy: three children (components), 1 parent, & 1  grandparent 

function PregnancyWheel() {

    return (
        <>

<div className="container-fluid page-body-wrapper">
<Sidebar/>
  <div className="main-panel">
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title-nav">
          <span className="page-title-icon bg-gradient-primary text-white me-2">
          {/* <i class="bi bi-folder menu-icon"></i> */}
          <i class="bi bi-calendar-heart menu-icon"></i>
          </span>{" "}
          PregnancyWheel
        </h3>

      </div>
    </div>
  </div>
  </div>
  <PregnancyWheelTAB/>
    </>
    )
}

export default PregnancyWheel;
