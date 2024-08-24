import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Global/Navbar_Main';
import { auth, storage, crud } from '../Config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyle.css';

// Your UserProfile component
function UserProfile() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [profilePic, setProfilePic] = useState('default-profile-pic-url');
  const [previewPic, setPreviewPic] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [personalDetails, setPersonalDetails] = useState({
    name: 'John Ray Gloria',
    location: 'Olongapo City East Tapinac',
    phone: '#09999999999',
    email: 'johnraygloria80@gmail.com',
    age: '21',
    gender: 'Male',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
        const storedData = localStorage.getItem(`appointmentData_${user.uid}`);
        setAppointmentData(storedData ? JSON.parse(storedData) : null);
        await fetchProfilePicture(user.uid);
        await fetchPersonalDetails(user.uid); // Fetch personal details
      } else {
        setUser(null);
        setUserId(null);
        setAppointmentData(null);
        setProfilePic('default-profile-pic-url');
        setPreviewPic('');
        setPersonalDetails({
          name: '',
          location: '',
          phone: '',
          email: '',
          age: '',
          gender: '',
        });
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
  }, [location.state, user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewPic(previewUrl);
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    if (!user) return;

    const fileRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      console.log('Download URL:', downloadURL); // Debugging log
      await updateProfilePicture(downloadURL);
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const updateProfilePicture = async (url) => {
    if (!user) return;

    try {
      const userRef = doc(crud, `users/${user.uid}`);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(userRef, { profilePicture: url });
      } else {
        // Document does not exist, create it
        await setDoc(userRef, { profilePicture: url });
      }

      setProfilePic(url);
      setPreviewPic('');
      console.log('Profile picture updated:', url); // Debugging log
    } catch (error) {
      console.error("Error updating profile picture URL: ", error);
    }
  };    

  const fetchProfilePicture = async (userId) => {
    try {
      const userRef = doc(crud, `users/${userId}`);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const picUrl = data.profilePicture || 'default-profile-pic-url';
        setProfilePic(picUrl);
        console.log('Fetched profile picture:', picUrl); // Debugging log
      } else {
        setProfilePic('default-profile-pic-url');
      }
    } catch (error) {
      console.error("Error fetching profile picture: ", error);
    }
  };

  const fetchPersonalDetails = async (userId) => {
    try {
      const userRef = doc(crud, `users/${userId}`);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPersonalDetails({
          name: data.name || '',
          location: data.location || '',
          phone: data.phone || '',
          email: data.email || '',
          age: data.age || '',
          gender: data.gender || '',
        });
        console.log('Fetched personal details:', data); // Debugging log
      }
    } catch (error) {
      console.error("Error fetching personal details: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const userRef = doc(crud, `users/${user.uid}`);
      await updateDoc(userRef, personalDetails);
      setEditMode(false);
      setShowModal(false); // Hide modal on save
      console.log('Personal details updated:', personalDetails); // Debugging log
    } catch (error) {
      console.error("Error updating personal details: ", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="row mx-auto">
          <div className="col-xl-15">
            <div className="card mx-auto">
              <div className="card-body pb-0 mx-auto">
                <div className="row align-items-center mx-auto">
                  <div className="col-md-5 mx-auto">
                    <div className="text-center border-end mx-auto">
                      <img
                        src={previewPic || profilePic}
                        className="img-fluid avatar-xxl rounded-circle"
                        alt="Profile"
                      />
                      <h4 className="text-primary font-size-20 mt-3 mb-2">
                        {personalDetails.name}
                      </h4>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                      />
                      <label htmlFor="fileInput" className="btn btn-primary mt-2">
                        Choose Picture
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="ms-2">
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title mb-4">Personal Details</h4>
                          <div className="table-responsive">
                            <table className="table table-bordered mb-0">
                              <tbody>
                                <tr>
                                  <th scope="row">Name</th>
                                  <td>{personalDetails.name}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Email</th>
                                  <td>{personalDetails.email}</td>
                                </tr>
                                <tr>                                
                                  <th scope="row">Age</th>
                                  <td>{personalDetails.age}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Gender</th>
                                  <td>{personalDetails.gender}</td>
                                </tr>
                                <tr>       
                                  <th scope="row">Phone</th>
                                  <td>{personalDetails.phone}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Location</th>
                                  <td>{personalDetails.location}</td>
                                </tr>
                              </tbody>
                            </table>
                            <button className="btn btn-primary mt-2" onClick={() => setShowModal(true)}>
                              Edit
                            </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Editing Personal Details */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog row mt-.25" role="document">
          <div className="modal-content ">
            <div className="modal-header ">
              <h5 className="modal-title  " id="exampleModalLabel">Edit Personal Details</h5>
              <button type="button" className="btn-close " onClick={() => setShowModal(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-1">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={personalDetails.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={personalDetails.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="age" className="form-label">Age</label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={personalDetails.age}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    value={personalDetails.gender}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={personalDetails.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={personalDetails.location}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer col-mb-1">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
