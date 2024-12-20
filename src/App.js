// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute'; // Admin protected route
import UserProtectedRoute from './UserProtectedRoute'; // User protected route
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// Import Components
import AdminLogin from './Components/Admin/AdminLogin/AdminLogin.jsx';
import Dashboard from './Components/Admin/DashboardAdmin';
import PatientsRecord from './Components/Admin/PatientsRecord';
import WelcomeLanding from './Components/Landing/WelcomeLanding.jsx';
import Error404 from './Components/Global/Error404.jsx';
import LoginForm from './Components/Auth/LoginForm/LoginForm.jsx';
import RegistrationForm from './Components/Auth/RegistrationForm/RegistrationForm.jsx';
import PasswordResetForm from './Components/Auth/LoginForm/PasswordResetForm.jsx';
import Home from './Pages/Home.jsx';
import Clinic from './Pages/CheckHealth.jsx';
import FillUpAppointment from './Pages/FillUpAppointment.jsx';
import Articles from './Pages/Articles.jsx';
import PregnancyWheel from './Components/Admin/PregnancyWheelLMP.jsx';
import PlanItAssistant from './Pages/PlanItAssistant.jsx'
import UserProfile from './Pages/UserProfile.jsx';
import OvulationTracker from './Pages/OvulationTracker.jsx';
import AboutUs from './Pages/Aboutus.jsx';

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
          <Route path='/Register/TermsAndConditions' component={RegistrationForm} exact />
          <Route path='/Register/DataPrivacyAct' component={RegistrationForm} exact />
          <Route path='/Resetyourpassword' component={PasswordResetForm} exact />
          <Route path="/StMargaretLyingInClinic" component={Clinic} exact />

          {/* User-protected routes */}
          <UserProtectedRoute path='/Aboutus' component={AboutUs} exact />
          <UserProtectedRoute path='/Home' component={Home} exact />
          <UserProtectedRoute path='/Articles' component={Articles} exact />
          <UserProtectedRoute path='/PlanItAssistant' component={PlanItAssistant} exact />
          <UserProtectedRoute path='/UserProfile' component={UserProfile} exact />
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
