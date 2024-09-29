// App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

// Import your components here
import AdminLogin from './Components/Admin/AdminLogin/AdminLogin.jsx';
import Dashboard from './Components/Admin/DashboardAdmin';
import PatientsRecord from './Components/Admin/PatientsRecord';
import WelcomeLanding from './Components/Landing/WelcomeLanding.jsx';
import Error404 from './Components/Global/Error404.jsx';

// Other user-side components
import LoginForm from './Components/Auth/LoginForm/LoginForm.jsx';
import Aboutus from './Components/About.jsx';
import RegistrationForm from './Components/Auth/RegistrationForm/RegistrationForm.jsx';
import PasswordResetForm from './Components/Auth/LoginForm/PasswordResetForm.jsx';
import Home from './pages/Home.jsx';
import Clinic from './pages/CheckHealth';
import Appointment from './pages/CalendarAppointment';
import FillUpAppointment from './pages/FillUpAppointment';
import Articles from './pages/Articles';
import PregnancyWheel from './Components/Admin/TabView/PregnancyWheel.jsx';
import Chatbot from './pages/Chatbot.jsx';
import UserProfile from './pages/UserProfile';
import OvulationTracker from './pages/OvulationTracker.jsx';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path='/' component={WelcomeLanding} exact />
          <Route path='/Welcome' component={WelcomeLanding} exact/>
          <Route path='/Login' component={LoginForm} exact />
          <Route path='/Aboutus' component={Aboutus} exact />
          <Route path='/Register' component={RegistrationForm} exact />
          <Route path="/Home" component={Home} exact />
          <Route path="/CheckHealth" component={Clinic} exact />
          <Route path='/Articles' component={Articles} exact />
          <Route path='/Resetyourpassword' component={PasswordResetForm} exact />
          <Route path='/Chatbot' component={Chatbot} exact />
          <Route path='/UserProfile' component={UserProfile} exact />
          <Route path='/Appointment' component={Appointment} exact />
          <Route path='/FillUpAppointment' component={FillUpAppointment} exact />
          <Route path='/OvulationTracker' component={OvulationTracker} exact />
          <ProtectedRoute path='/PregnancyWheel' component={PregnancyWheel} exact />
          <ProtectedRoute path='/Dashboard' component={Dashboard} exact />
          <ProtectedRoute path='/PatientsRecord' component={PatientsRecord} exact />
          <Route path='/AdminLogin' component={AdminLogin} exact />
          <Route component={Error404} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
