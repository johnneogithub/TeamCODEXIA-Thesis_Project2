// React Libraries and Things
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Landing
import LoginForm from './Components/Auth/LoginForm/LoginForm.jsx';
import About from './Components/About.jsx';
import RegistrationForm from './Components/Auth/RegistrationForm/RegistrationForm.jsx';
import PasswordResetForm from './Components/Auth/LoginForm/PasswordResetForm.jsx';

// Pages
import Home from './pages/Home.jsx';
import Clinic from './pages/CheckHealth';
import Appointment from './pages/CalendarAppointment';
import FillUpAppointment from './pages/FillUpAppointment';
import Articles from './pages/Articles';
import Dashboard from './Components/Admin/DashboardAdmin';
import PregnancyWheel from './Components/Admin/TabView/PregnancyWheel.jsx';
import Chatbot from './pages/Chatbot.jsx';
import PatientsRecord from './Components/Admin/PatientsRecord';
import UserProfile from './pages/UserProfile';
import OvulationTracker from './pages/OvulationTracker.jsx';
import Error404 from '../src/Components/Global/Error404.jsx';

function App() {
  //const [data, setData] = useState([]);

  /*useEffect(() => {
    fetch("/members")
      .then(res => res.json())
      .then(data => {
        setData(data);
        console.log(data);
      });
  }, []);*/

  return (
    <Router>
      <>
      {/*<div>

        {(typeof data.members === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          data.members.map((member, i ) => (
          <p key={i}>{member}</p>
        ))
        )} 

      </div> */}
        {/* <Navbar/> */}
        <Switch>
          <Route path='/' component={LoginForm} exact />
          <Route path='/Login' component={LoginForm} exact />
          <Route path='/About' component={About} exact />
          <Route path='/Register' component={RegistrationForm} exact />
          <Route path="/Home" component={Home} exact />
          <Route path="/StMargaretLyingInClinic" component={Clinic} exact />
          <Route path='/Articles' component={Articles} exact />
          <Route path='/Resetyourpassword' component={PasswordResetForm} exact />
          <Route path='/Chatbot' component={Chatbot} exact />
          <Route path='/UserProfile' component={UserProfile} exact />
          <Route path='/Appointment' component={Appointment} exact />
          <Route path='/FillUpAppointment' component={FillUpAppointment} exact />
          <Route path='/OvulationTracker' component={OvulationTracker} exact />
          <Route path='/PregnancyWheel' component={PregnancyWheel} exact />
          <Route path='/Dashboard' component={Dashboard} exact />
          <Route path='/PatientsRecord' component={PatientsRecord} exact />
          <Route component={Error404} />
        </Switch>
      </>
    </Router>
  );
}

export default App;
