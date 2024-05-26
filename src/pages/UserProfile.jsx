import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Moment from 'react-moment';
import Navbar from '../Components/Global/Navbar_Main';
import picuser from '../Components/Assets/userpic.jpg';
import { auth } from '../Config/firebase';

import 'bootstrap/dist/css/bootstrap.min.css'
import './UserProfileStyle.css';


function UserProfile() {
  let date = new Date();
  const location = useLocation();
  const [user, setUser] = useState(null); 
  const [appointmentData, setAppointmentData] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [isApproved, setIsApproved] = useState(false); 
  // const [isRejected, setIsRejected] = useState(false); 


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
        const storedData = localStorage.getItem(`appointmentData_${user.uid}`);
        setAppointmentData(storedData ? JSON.parse(storedData) : null);
      } else {
        setUser(null);
        setUserId(null);
        setAppointmentData(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if (location.state && location.state.appointmentData) {
      setAppointmentData(location.state.appointmentData);
      if (user) {
        localStorage.setItem(`appointmentData_${user.uid}`, JSON.stringify(location.state.appointmentData));
      }
    }
    if (location.state && location.state.action === 'approve') {
      setIsApproved(true); 
    }
    // if (appointmentData && appointmentData.rejected) {
    //   setIsRejected(true); 
    // }
  }, [location.state, user]);


return (
  <>
  <Navbar/>
<div className="container mx-auto">
  <div className="row mx-auto">
    <div className="col-xl-15">
      <div className="card  mx-auto">
        <div className="card-body pb-0  mx-auto">
          <div className="row align-items-center  mx-auto">
            <div className="col-md-5  mx-auto">
              <div className="text-center border-end  mx-auto">
                <img
                  src={picuser}
                  className="img-fluid avatar-xxl rounded-circle"
                  alt=""
                />
                <h4 className="text-primary font-size-20 mt-3 mb-2">
                  John Ray Gloria
                </h4>
              </div>
            </div>
            {/* end col */}
            <div className="row">
    <div className="ms-2 ">
      <div className="card">
        <div className="card-body">
          <div>
            <h4 className="card-title mb-4">Personal Details</h4>
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <tbody>
                  <tr>
                    <th scope="row">Name</th>
                    <td>John Ray Gloria</td>
                  </tr>
                  <tr>
                    <th scope="row">Location</th>
                    <td>Olongapo City East Tapinac</td>
                  </tr>
                  <tr>
                    <th scope="row">Phone</th>
                    <td>#09999999999</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>johnraygloria80@gmail.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
        
            <div className="row">
              <div className="col-xl-12">
                <div className="task-list-box" id="landing-task">
                  <div id="task-item-1">
                    <div className="card task-box rounded-3">
                      <div className="card-body">
                        <div className="row align-items-center">
                              <h4 className="card-title">Approved Appointment</h4>
                              <div className="table-responsive">
                                <table className="table">
                                <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Type of Appointment</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                                    {appointmentData && user.uid === userId && ( 
                                      <tr>
                                        <td></td>
                                        <td>{appointmentData.name}</td>
                                        <td>{appointmentData.email}</td>
                                        <td>{appointmentData.age}</td>
                                        <td>{appointmentData.appointmentType}</td>
                                        <td>{appointmentData.date}</td>
                                        <td>{appointmentData.time}</td>
                                        <td>
                                        {isApproved ? 'Approved' : 'Pending'}
                                        {/* {!isApproved && isRejected ? 'Rejected' : ''} */}
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                                
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {/* end */}
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          {/* end tab pane */}


      {/* end card */}
    </div>

  </div>
</div>

  </>
);

}

export default UserProfile;