// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute'; // Admin protected route
import UserProtectedRoute from './UserProtectedRoute'; // User protected route
import './App.css';

// Import components
import AdminLogin from './Components/Admin/AdminLogin/AdminLogin.jsx';
import Dashboard from './Components/Admin/DashboardAdmin';
import PatientsRecord from './Components/Admin/PatientsRecord';
import WelcomeLanding from './Components/Landing/WelcomeLanding.jsx';
import Error404 from './Components/Global/Error404.jsx';
import LoginForm from './Components/Auth/LoginForm/LoginForm.jsx';
import RegistrationForm from './Components/Auth/RegistrationForm/RegistrationForm.jsx';
import PasswordResetForm from './Components/Auth/LoginForm/PasswordResetForm.jsx';
import Home from './pages/Home.jsx';
import Clinic from './pages/CheckHealth';
import Appointment from './pages/CalendarAppointment';
import FillUpAppointment from './pages/FillUpAppointment';
import Articles from './pages/Articles';
import PregnancyWheel from './Components/Admin/PregnancyWheelLMP.jsx';
import Chatbot from './pages/Chatbot.jsx';
import UserProfile from './pages/UserProfile';
import OvulationTracker from './pages/OvulationTracker.jsx';
import AboutUs from './pages/Aboutus.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GoogleAnalyticsHandler />
        <Switch>
          <Route path='/' component={WelcomeLanding} exact />
          <Route path='/Welcome' component={WelcomeLanding} exact />
          <Route path='/Login' component={LoginForm} exact />
          <Route path='/Register' component={RegistrationForm} exact />
          <Route path='/Resetyourpassword' component={PasswordResetForm} exact />
          <Route path="/StMargaretLyingInClinic" component={Clinic} exact />

          {/* User-protected routes */}
          <UserProtectedRoute path='/Aboutus' component={AboutUs} exact />
          <UserProtectedRoute path='/Home' component={Home} exact />
          <UserProtectedRoute path='/Articles' component={Articles} exact />
          <UserProtectedRoute path='/Chatbot' component={Chatbot} exact />
          <UserProtectedRoute path='/UserProfile' component={UserProfile} exact />
          <UserProtectedRoute path='/Appointment' component={Appointment} exact />
          <UserProtectedRoute path='/FillUpAppointment' component={FillUpAppointment} exact />
          <UserProtectedRoute path='/OvulationTracker' component={OvulationTracker} exact />

          {/* Admin-protected routes */}
          <ProtectedRoute path='/PregnancyWheel' component={PregnancyWheel} exact />
          <ProtectedRoute path='/Dashboard' component={Dashboard} exact />
          <ProtectedRoute path='/PatientsRecord' component={PatientsRecord} exact />
          <Route path='/AdminLogin' component={AdminLogin} exact />

          {/* 404 Error Route */}
          <Route component={Error404} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

// Component to handle Google Analytics tracking
function GoogleAnalyticsHandler() {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-TQF0WD897P', {
      page_path: location.pathname + location.search,
    });
    console.log('Pageview tracked:', location.pathname + location.search);
  }, [location]);

  return null;
}

export default App;
