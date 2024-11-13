import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Global/Navbar_Main';
import { auth, storage, crud } from '../Config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaPhone, FaMapMarkerAlt, FaEdit, FaCamera, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyle.css';
import defaultProfilePic from '.././Components/Assets/icon_you.png';

function UserProfile() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [previewPic, setPreviewPic] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
  });
  const [remark, setRemark] = useState('');
  const [remarkTimestamp, setRemarkTimestamp] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [birthdate, setBirthdate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setPersonalDetails(prev => ({
          ...prev,
          email: user?.email || ''
        }));

        const storedData = localStorage.getItem(`appointmentData_${user.uid}`);
        if (storedData && storedData !== "undefined") {
          try {
            const parsedData = JSON.parse(storedData);
            setAppointmentData(parsedData);
          } catch (e) { 
            console.error("Error parsing JSON from localStorage:", e);
            setAppointmentData(null); 
          }
        } else {
          setAppointmentData(null); 
        }

        await fetchProfilePicture(user.uid);
        await fetchPersonalDetails(user.uid);
        const unsubscribeAppointments = subscribeToAppointments(user.uid);

        return () => unsubscribeAppointments(); 
      } else {
        resetState();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (location.state) {
      setAppointmentData(location.state.appointmentData);
      setShowRemark(location.state.showRemark || false);
    }
  }, [location]);
  
  useEffect(() => {
    let ageInterval;
    
    if (birthdate) {
      // Update age immediately
      updateAge();
      
      // Check for age updates every day at midnight
      ageInterval = setInterval(() => {
        updateAge();
      }, 86400000); // 24 hours in milliseconds
    }

    return () => {
      if (ageInterval) {
        clearInterval(ageInterval);
      }
    };
  }, [birthdate]);

  const resetState = () => {
    setUser(null);
    setAppointmentData(null);
    setProfilePic(defaultProfilePic);
    setPreviewPic('');
    setPersonalDetails({
      name: '',
      location: '',
      phone: '',
      email: '',
      age: '',
      gender: '',
    });
  };

  const subscribeToAppointments = (userId) => {
    const userRef = doc(crud, `users/${userId}`);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      const data = doc.data();
      if (data && data.appointmentData) {
        setAppointmentData(data.appointmentData);
        setIsApproved(data.appointmentData.status === 'approved');
        setRemark(data.appointmentData.remark || '');
        setRemarkTimestamp(data.appointmentData.remarkTimestamp || null);
        setMessage(data.appointmentData.message || '');
        console.log("Updated appointment data:", data.appointmentData);
      }
    });
    return unsubscribe;
  };
  
  
  
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    const previewUrl = URL.createObjectURL(file);
    setPreviewPic(previewUrl);
    setIsUploading(true);
    uploadFile(file).finally(() => {
      setIsUploading(false);
    });
  };

  const uploadFile = async (file) => {
    if (!user) {
      console.error("No user is authenticated");
      return;
    }
  
    const fileRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      console.log("File uploaded successfully");
  
      const downloadURL = await getDownloadURL(fileRef);
      console.log("Download URL:", downloadURL);
      await updateProfilePicture(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle the error and show a user-friendly message
      if (error.code === 'storage/unauthorized') {
        alert("You don't have permission to upload files. Please contact support.");
      } else {
        alert("An error occurred while uploading the file. Please try again later.");
      }
      // Reset the preview picture
      setPreviewPic('');
    }
  };

  const updateProfilePicture = async (url) => {
    if (!user) {
      console.error("No user is authenticated");
      return;
    }
  
    try {
      const userRef = doc(crud, `users/${user.uid}`);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        await updateDoc(userRef, {
          profilePicture: url
        });
  
        setProfilePic(url);
        setPreviewPic('');
        console.log("Profile picture updated successfully:", url);
      } else {

        await setDoc(userRef, {
          profilePicture: url,
          appointmentData: appointmentData || null, 
          isApproved: isApproved || false,
          ...personalDetails 
        });
  
        setProfilePic(url);
        setPreviewPic('');
        console.log("Document created and profile picture set successfully:", url);
      }
    } catch (error) {
      console.error("Error updating profile picture URL:", error);
    }
  };
  


  const fetchProfilePicture = async (userId) => {
    try {
      const userRef = doc(crud, `users/${userId}`);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfilePic(data.profilePicture || defaultProfilePic);
      } else {
        setProfilePic(defaultProfilePic);
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
        
        // Store birthdate in state for real-time updates
        if (data.birthdate) {
          setBirthdate(data.birthdate);
        }

        setPersonalDetails(prev => ({
          ...prev,
          name: `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim(),
          firstName: data.firstName || '',
          middleName: data.middleName || '',
          lastName: data.lastName || '',
          location: data.location || '',
          phone: data.phone || '',
          email: auth.currentUser?.email || prev.email || '',
          gender: data.gender || '',
        }));
      } else {
        setPersonalDetails(prev => ({
          ...prev,
          email: auth.currentUser?.email || '',
          name: auth.currentUser?.displayName || ''
        }));
      }
    } catch (error) {
      console.error("Error fetching personal details: ", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDetails({
      ...personalDetails,
      firstName: personalDetails.firstName || '',
      middleName: personalDetails.middleName || '',
      lastName: personalDetails.lastName || '',
      age: personalDetails.age || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const userRef = doc(crud, `users/${user.uid}`);
      
      // Create the data to be saved
      const dataToSave = {
        firstName: editedDetails.firstName,
        middleName: editedDetails.middleName,
        lastName: editedDetails.lastName,
        location: editedDetails.location,
        phone: editedDetails.phone,
        email: editedDetails.email,
        gender: editedDetails.gender,
        age: editedDetails.age,
      };

      // Update Firestore
      await updateDoc(userRef, dataToSave);

      // Update local state
      setPersonalDetails({
        ...dataToSave,
        name: `${dataToSave.firstName} ${dataToSave.middleName} ${dataToSave.lastName}`.trim(),
      });
      
      setIsEditing(false);

      // Check if all required fields are filled
      const isProfileComplete = Object.values(dataToSave).every(value => value && value.trim() !== '');
      await updateDoc(userRef, { isProfileComplete });

    } catch (error) {
      console.error("Error updating personal details: ", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetails({});
  };

  // Add this function to safely capitalize the first letter
  const capitalizeFirstLetter = (string) => {
    return string && typeof string === 'string' ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  const updateAge = () => {
    if (!birthdate) return;

    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setPersonalDetails(prev => ({
      ...prev,
      age: `${age} years old`
    }));
  };

  return (
    <div className="user-profile-page">
      <Navbar />
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card profile-card shadow">
              <div className="card-body text-center">
                <div className="profile-image-container mb-4">
                  {previewPic || profilePic ? (
                    <img
                      src={previewPic || profilePic}
                      className="profile-image rounded-circle"
                      alt="Profile"
                    />
                  ) : (
                    <FaUserCircle className="profile-icon" size={150} />
                  )}
                  <label htmlFor="fileInput" className="edit-profile-pic">
                    {isUploading ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <FaCamera size={24} />
                    )}
                  </label>
                </div>
                <h3 className="mb-2">{personalDetails.name || 'User'}</h3>
                <p className="text-muted">{personalDetails.email}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="fileInput"
                />
              </div>
            </div>
            
            <div className="card mt-4 remark-card shadow">
              <div className="card-body">
                <h4 className="card-title mb-4">Appointment Remark</h4>
                {remark ? (
                  <>
                    <p>{remark}</p>
                    {remarkTimestamp && (
                      <small className="text-muted">
                        Added on: {new Date(remarkTimestamp).toLocaleString()}
                      </small>
                    )}
                  </>
                ) : (
                  <p>No remark available</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card details-card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title m-0">Personal Details</h4>
                  {!isEditing && (
                    <button className="btn btn-outline-primary btn-sm" onClick={handleEdit}>
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>
                <div className="row">
                  {isEditing ? (
                    <>
                      <div className="col-md-4 mb-3">
                        <div className="detail-item">
                          <FaUser className="detail-icon" />
                          <div className="ms-3">
                            <h6 className="mb-0 text-muted">First Name</h6>
                            <input
                              type="text"
                              className="form-control"
                              name="firstName"
                              value={editedDetails.firstName || ''}
                              onChange={handleChange}
                              placeholder="Enter first name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="detail-item">
                          <FaUser className="detail-icon" />
                          <div className="ms-3">
                            <h6 className="mb-0 text-muted">Middle Name</h6>
                            <input
                              type="text"
                              className="form-control"
                              name="middleName"
                              value={editedDetails.middleName || ''}
                              onChange={handleChange}
                              placeholder="Enter middle name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="detail-item">
                          <FaUser className="detail-icon" />
                          <div className="ms-3">
                            <h6 className="mb-0 text-muted">Last Name</h6>
                            <input
                              type="text"
                              className="form-control"
                              name="lastName"
                              value={editedDetails.lastName || ''}
                              onChange={handleChange}
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-md-6 mb-3">
                      <div className="detail-item d-flex align-items-center">
                        <FaUser className="detail-icon" />
                        <div className="ms-3">
                          <h6 className="mb-0 text-muted">Name</h6>
                          <p className="mb-0 fw-bold">{personalDetails.name || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Render other fields */}
                  {Object.entries(isEditing ? editedDetails : personalDetails)
                    .filter(([key]) => !['name', 'firstName', 'middleName', 'lastName', 'age'].includes(key))
                    .map(([key, value]) => (
                      <div className="col-md-6 mb-3" key={key}>
                        <div className="detail-item d-flex align-items-center">
                          {getIcon(key)}
                          <div className="ms-3">
                            <h6 className="mb-0 text-muted">{capitalizeFirstLetter(key)}</h6>
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control"
                                name={key}
                                value={value}
                                onChange={handleChange}
                              />
                            ) : (
                              <p className="mb-0 fw-bold">{value || 'Not provided'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  {/* Add single age field */}
                  <div className="col-md-6 mb-3">
                    <div className="detail-item d-flex align-items-center">
                      <FaCalendarAlt className="detail-icon" />
                      <div className="ms-3">
                        <h6 className="mb-0 text-muted">Age</h6>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            name="age"
                            value={editedDetails.age || ''}
                            onChange={handleChange}
                            placeholder="Enter age"
                          />
                        ) : (
                          <p className="mb-0 fw-bold">{personalDetails.age || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="mt-3">
                    <button className="btn btn-primary me-2" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card mt-4 appointment-card shadow">
              <div className="card-body">
                <h4 className="card-title mb-4">Appointment Status</h4>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentData ? (
                        <tr>
                          <td>{appointmentData.name}</td>
                          <td>{appointmentData.appointmentType}</td>
                          <td>{appointmentData.date}</td>
                          <td>{appointmentData.time}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(appointmentData.status)}`}>
                              {capitalizeFirstLetter(appointmentData.status || 'pending')}
                            </span>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No appointment data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {message && (
                  <div className="mt-3">
                    <h5>Additional Message:</h5>
                    <p>{message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getIcon(key) {
  switch (key) {
    case 'name': return <FaUser className="detail-icon" />;
    case 'email': return <FaEnvelope className="detail-icon" />;
    case 'age': return <FaCalendarAlt className="detail-icon" />;
    case 'gender': return <FaVenusMars className="detail-icon" />;
    case 'phone': return <FaPhone className="detail-icon" />;
    case 'location': return <FaMapMarkerAlt className="detail-icon" />;
    default: return null;
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'approved': return 'bg-success';
    case 'rejected': return 'bg-danger';
    case 'remarked': return 'bg-info';
    default: return 'bg-warning';
  }
}

export default UserProfile;