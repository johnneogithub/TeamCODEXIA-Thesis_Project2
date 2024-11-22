import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Global/Navbar_Main';
import { auth, storage, crud } from '../Config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaPhone, FaMapMarkerAlt, FaEdit, FaCamera, FaUserCircle, FaFileDownload, FaHistory, FaCheckCircle, FaTimesCircle, FaCommentDots, FaClock, FaThLarge, FaList, FaFolder, FaComment, FaEye, FaImage, FaFile } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyle.css';
import defaultProfilePic from '.././Components/Assets/icon_you.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getStatusIcon = (status) => {
  switch(status) {
    case 'completed': return <FaCheckCircle color="#28a745" />;
    case 'rejected': return <FaTimesCircle color="#dc3545" />;
    case 'remarked': return <FaCommentDots color="#17a2b8" />;
    default: return <FaClock color="#ffc107" />;
  }
};

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
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showImportedFileModal, setShowImportedFileModal] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);

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
        await fetchInitialHistory(user.uid);
        const unsubscribeAppointments = subscribeToAppointments(user.uid);

        await fetchMedicalRecords(user.uid);

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
      updateAge();
      
      ageInterval = setInterval(() => {
        updateAge();
      }, 86400000);
    }

    return () => {
      if (ageInterval) {
        clearInterval(ageInterval);
      }
    };
  }, [birthdate]);

  useEffect(() => {
    if (user) {
      fetchProfilePicture(user.uid);
      fetchPersonalDetails(user.uid);
      fetchInitialHistory(user.uid);
      fetchMedicalRecords(user.uid);
      const unsubscribeAppointments = subscribeToAppointments(user.uid);

      return () => unsubscribeAppointments();
    } else {
      resetState();
    }
  }, [user]);

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
    const unsubscribe = onSnapshot(userRef, async (docSnapshot) => {
      const data = docSnapshot.data();
      if (data) {
        if (data.appointmentData) {
          // Check for medical records associated with current appointment
          const currentRecord = data.medicalRecords?.find(record => 
            record.appointmentDate === data.appointmentData.date && 
            record.appointmentTime === data.appointmentData.time
          );

          setAppointmentData({
            ...data.appointmentData,
            importedFile: currentRecord ? {
              name: currentRecord.fileName,
              url: currentRecord.fileUrl,
              type: currentRecord.fileType,
              uploadedAt: currentRecord.uploadedAt,
              uploadedBy: currentRecord.uploadedBy
            } : null
          });

          setIsApproved(data.appointmentData.status === 'approved');
          setRemark(data.appointmentData.remark || '');
          setRemarkTimestamp(data.appointmentData.remarkTimestamp || null);
          setMessage(data.appointmentData.message || '');

          if (['completed', 'rejected', 'remarked'].includes(data.appointmentData.status)) {
            await updateAppointmentHistory(userId, data.appointmentData);
          }
        }

        // Update appointment history with medical records
        let allAppointments = [];
        if (data.appointmentData) {
          const currentRecord = data.medicalRecords?.find(record => 
            record.appointmentDate === data.appointmentData.date && 
            record.appointmentTime === data.appointmentData.time
          );

          allAppointments.push({
            ...data.appointmentData,
            isCurrent: true,
            completedAt: data.appointmentData.completedAt || new Date().toISOString(),
            importedFile: currentRecord ? {
              name: currentRecord.fileName,
              url: currentRecord.fileUrl,
              type: currentRecord.fileType,
              uploadedAt: currentRecord.uploadedAt,
              uploadedBy: currentRecord.uploadedBy
            } : null
          });
        }

        if (data.appointmentHistory) {
          const historyWithRecords = data.appointmentHistory.map(appointment => {
            const record = data.medicalRecords?.find(record => 
              record.appointmentDate === appointment.date && 
              record.appointmentTime === appointment.time
            );

            return {
              ...appointment,
              importedFile: record ? {
                name: record.fileName,
                url: record.fileUrl,
                type: record.fileType,
                uploadedAt: record.uploadedAt,
                uploadedBy: record.uploadedBy
              } : null
            };
          });

          allAppointments = [...allAppointments, ...historyWithRecords];
        }

        const sortedAppointments = allAppointments.sort((a, b) => {
          const dateA = new Date(a.date + ' ' + a.time);
          const dateB = new Date(b.date + ' ' + b.time);
          return dateB - dateA;
        });

        setAppointmentHistory(sortedAppointments);
        
        // Update appointment counts
        const counts = {
          total: sortedAppointments.length,
          completed: sortedAppointments.filter(app => app.status === 'completed').length,
          rejected: sortedAppointments.filter(app => app.status === 'rejected').length,
          remarked: sortedAppointments.filter(app => app.status === 'remarked').length,
          pending: sortedAppointments.filter(app => app.status === 'pending' || !app.status).length
        };
        
        await updateDoc(userRef, {
          appointmentHistoryCount: counts
        });
      }
    });
    return unsubscribe;
  };

  const updateAppointmentHistory = async (userId, appointmentData) => {
    try {
      const userRef = doc(crud, `users/${userId}`);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const currentHistory = docSnap.data().appointmentHistory || [];
        
        const existingAppointmentIndex = currentHistory.findIndex(
          appointment => 
            appointment.date === appointmentData.date && 
            appointment.time === appointmentData.time
        );

        let updatedHistory = [...currentHistory];
        const newAppointment = {
          ...appointmentData,
          completedAt: new Date().toISOString(),
          status: appointmentData.status
        };

        if (existingAppointmentIndex !== -1) {
          updatedHistory[existingAppointmentIndex] = {
            ...updatedHistory[existingAppointmentIndex],
            ...newAppointment
          };
        } else {
          updatedHistory.push(newAppointment);
        }
        
        updatedHistory.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });
        
        const counts = {
          total: updatedHistory.length,
          completed: updatedHistory.filter(app => app.status === 'completed').length,
          rejected: updatedHistory.filter(app => app.status === 'rejected').length,
          remarked: updatedHistory.filter(app => app.status === 'remarked').length,
          pending: updatedHistory.filter(app => app.status === 'pending' || !app.status).length
        };
        
        await updateDoc(userRef, {
          appointmentHistory: updatedHistory,
          appointmentHistoryCount: counts
        });
        
        setAppointmentHistory(updatedHistory);
      }
    } catch (error) {
      console.error("Error updating appointment history:", error);
    }
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
      if (error.code === 'storage/unauthorized') {
        alert("You don't have permission to upload files. Please contact support.");
      } else {
        alert("An error occurred while uploading the file. Please try again later.");
      }
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

      await updateDoc(userRef, dataToSave);

      setPersonalDetails({
        ...dataToSave,
        name: `${dataToSave.firstName} ${dataToSave.middleName} ${dataToSave.lastName}`.trim(),
      });
      
      setIsEditing(false);

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

  const fetchInitialHistory = async (userId) => {
    try {
      const userRef = doc(crud, `users/${userId}`);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        let history = data.appointmentHistory || [];
        
        if (data.appointmentData) {
          const currentAppointment = {
            ...data.appointmentData,
            isCurrent: true
          };
          
          history = history.filter(historyApp => 
            !(historyApp.date === currentAppointment.date && 
              historyApp.time === currentAppointment.time)
          );
          
          history.unshift(currentAppointment);
        }

        const sortedHistory = history.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });

        setAppointmentHistory(sortedHistory);

        const counts = {
          total: sortedHistory.length,
          completed: sortedHistory.filter(app => app.status === 'completed').length,
          rejected: sortedHistory.filter(app => app.status === 'rejected').length,
          remarked: sortedHistory.filter(app => app.status === 'remarked').length,
          pending: sortedHistory.filter(app => app.status === 'pending' || !app.status).length
        };

        await updateDoc(userRef, {
          appointmentHistory: sortedHistory,
          appointmentHistoryCount: counts
        });
      }
    } catch (error) {
      console.error("Error fetching initial history:", error);
    }
  };

  const renderFilePreview = (fileUrl) => {
    if (!fileUrl) return null;
    
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} alt="File preview" className="img-fluid" />;
    } else if (['pdf'].includes(fileExtension)) {
      return (
        <iframe
          src={fileUrl}
          title="PDF preview"
          width="100%"
          height="500px"
          frameBorder="0"
        />
      );
    } else {
      return (
        <div className="text-center p-4">
          <p>This file type cannot be previewed.</p>
          <a 
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Download File
          </a>
        </div>
      );
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleFilePreview = (appointment) => {
    if (appointment?.importedFile?.url) {
      setSelectedAppointment(appointment);
      setShowImportedFileModal(true);
    }
  };

  const fetchMedicalRecords = async (userId) => {
    try {
      console.log("Fetching medical records for user:", userId);
      const userRef = doc(crud, `users/${userId}`);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("User data:", userData);
        
        // Get both medical records and appointment history
        const medicalRecords = userData.medicalRecords || [];
        const appointmentHistory = userData.appointmentHistory || [];
        
        // Merge medical records with appointment history
        const updatedHistory = appointmentHistory.map(appointment => {
          const associatedRecord = medicalRecords.find(record => 
            record.appointmentDate === appointment.date && 
            record.appointmentTime === appointment.time
          );
          
          if (associatedRecord) {
            return {
              ...appointment,
              importedFile: {
                name: associatedRecord.fileName,
                url: associatedRecord.fileUrl,
                type: associatedRecord.fileType,
                uploadedAt: associatedRecord.uploadedAt,
                uploadedBy: associatedRecord.uploadedBy
              }
            };
          }
          return appointment;
        });

        // Update states
        setMedicalRecords(medicalRecords);
        setAppointmentHistory(updatedHistory);

        // If there's a current appointment, check if it has an associated medical record
        if (appointmentData) {
          const currentRecord = medicalRecords.find(record => 
            record.appointmentDate === appointmentData.date && 
            record.appointmentTime === appointmentData.time
          );
          
          if (currentRecord) {
            setAppointmentData(prev => ({
              ...prev,
              importedFile: {
                name: currentRecord.fileName,
                url: currentRecord.fileUrl,
                type: currentRecord.fileType,
                uploadedAt: currentRecord.uploadedAt,
                uploadedBy: currentRecord.uploadedBy
              }
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      toast.error("Failed to fetch medical records");
    }
  };

  const refreshMedicalRecords = async () => {
    if (user) {
      await fetchMedicalRecords(user.uid);
    }
  };

  useEffect(() => {
    if (showHistoryModal || showFileModal || showAppointmentDetails || showImportedFileModal) {
      const previousActiveElement = document.activeElement;
      
      return () => {
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
      };
    }
  }, [showHistoryModal, showFileModal, showAppointmentDetails, showImportedFileModal]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (showHistoryModal) setShowHistoryModal(false);
        if (showFileModal) setShowFileModal(false);
        if (showAppointmentDetails) setShowAppointmentDetails(false);
        if (showImportedFileModal) setShowImportedFileModal(false);
      }
    };

    if (showHistoryModal || showFileModal || showAppointmentDetails || showImportedFileModal) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showHistoryModal, showFileModal, showAppointmentDetails, showImportedFileModal]);

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
                
                {appointmentData?.importedFile && (
                  <div className="mt-4">
                    <h5 className="d-flex align-items-center">
                      <FaFileDownload className="me-2" /> Historical Data
                    </h5>
                    <div className="imported-file-info p-3 border rounded">
                      <button 
                        className="btn btn-outline-custom w-100 d-flex align-items-center justify-content-center"
                        onClick={() => setShowFileModal(true)}
                        style={{
                          color: '#520057',
                          borderColor: '#520057',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#520057';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#520057';
                        }}
                      >
                        <FaFileDownload className="me-2" />
                        <span>{appointmentData.importedFile.name}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card mt-4 history-card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title m-0">Appointment History</h4>
                  <div className="d-flex align-items-center">
                    <span className="badge  appointment-count me-2">
                      Total: {appointmentHistory.length}
                    </span>
                    <button 
                      className="btn btn-view-all"
                      onClick={() => setShowHistoryModal(true)}
                    >
                      <FaThLarge className="me-2" />
                      View All
                    </button>
                  </div>
                </div>
                
                {appointmentHistory.length > 0 ? (
                  <>
                    <div className="appointment-stats-user mb-3">
                      <div className="row g-2">
                        <div className="col-3">
                          <div className="stat-card pending">
                            <div className="stat-value">
                              {appointmentHistory.filter(app => app.status === 'pending' || !app.status).length}
                            </div>
                            <div className="stat-label">Pending</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="stat-card completed">
                            <div className="stat-value">
                              {appointmentHistory.filter(app => app.status === 'completed').length}
                            </div>
                            <div className="stat-label">Completed</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="stat-card rejected">
                            <div className="stat-value">
                              {appointmentHistory.filter(app => app.status === 'rejected').length}
                            </div>
                            <div className="stat-label">Rejected</div>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="stat-card remarked">
                            <div className="stat-value">
                              {appointmentHistory.filter(app => app.status === 'remarked').length}
                            </div>
                            <div className="stat-label">Remarked</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="appointment-history-list">
                      {appointmentHistory.slice(0, 1).map((appointment, index) => (
                        <div 
                          key={index} 
                          className={`appointment-history-item mb-3 p-3 border rounded ${appointment.isCurrent ? 'current-appointment' : ''}`}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <span className="fw-bold">{appointment.appointmentType}</span>
                              {appointment.isCurrent && (
                                <span className="badge bg-info ms-2">Current</span>
                              )}
                            </div>
                            <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                              {capitalizeFirstLetter(appointment.status || 'pending')}
                            </span>
                          </div>
                          <div className="text-muted small">
                            <div><strong>Date:</strong> {appointment.date}</div>
                            <div><strong>Time:</strong> {appointment.time}</div>
                            {appointment.message && (
                              <div><strong>Message:</strong> {appointment.message}</div>
                            )}
                            {appointment.remark && (
                              <div className="mt-2">
                                <strong>Remark:</strong> {appointment.remark}
                              </div>
                            )}
                            <div className="mt-1 text-end">
                              <small className="text-muted">
                                {appointment.isCurrent ? 'Current Appointment' : 
                                  `Updated: ${new Date(appointment.completedAt).toLocaleDateString()} at 
                                  ${new Date(appointment.completedAt).toLocaleTimeString()}`
                                }
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted">
                    <p>No appointment history available</p>
                    <small>Your appointments will appear here</small>
                  </div>
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
                        <th>Pricing Type</th>
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
                          <td>{formatPricingType(appointmentData.selectedPricingType)}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(appointmentData.status)}`}>
                              {capitalizeFirstLetter(appointmentData.status || 'pending')}
                            </span>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No appointment data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Add Selected Services Section */}
                {appointmentData?.selectedServices && appointmentData.selectedServices.length > 0 && (
                  <div className="mt-4">
                    <h5>Selected Services</h5>
                    <div className="selected-services-list">
                      {appointmentData.selectedServices.map((service, index) => (
                        <div key={index} className="service-item p-3 border rounded mb-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">{service.name}</h6>
                            <span className="badge bg-primary">
                              ₱{service[appointmentData.selectedPricingType]?.toLocaleString()}
                            </span>
                          </div>
                          {service.isPackage && service.components && (
                            <div className="mt-2">
                              <small className="text-muted">Package Components:</small>
                              <ul className="list-unstyled ms-3">
                                {service.components.map((component, idx) => (
                                  <li key={idx} className="d-flex justify-content-between">
                                    <span>{component.name}</span>
                                    <span>₱{component[appointmentData.selectedPricingType]?.toLocaleString()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="total-amount p-2 bg-light rounded">
                        <strong>Total Amount: </strong>
                        <span>₱{calculateTotal(appointmentData.selectedServices, appointmentData.selectedPricingType)}</span>
                      </div>
                    </div>
                  </div>
                )}

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
      <div 
        className={`modal fade ${showHistoryModal ? 'show' : ''}`}
        style={{ display: showHistoryModal ? 'block' : 'none' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="historyModalTitle"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content glass-modal">
            <div className="modal-header glass-header">
              <div className="d-flex align-items-center">
                <div className="header-icon">
                  <FaHistory size={24} />
                </div>
                <div className="ms-3">
                  <h4 className="modal-title mb-0">Appointment History</h4>
                  <small className="text-muted">View all your appointments</small>
                </div>
              </div>
              <button className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
            </div>

            <div className="modal-body p-4">
              <div className="glass-stats mb-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="glass-stat-card pending">
                      <div className="stat-content">
                        <FaClock className="stat-icon" />
                        <div className="stat-info">
                          <h3>{appointmentHistory.filter(app => app.status === 'pending' || !app.status).length}</h3>
                          <span>Pending</span>
                        </div>
                      </div>
                      <div className="stat-progress">
                        <div className="progress-ring"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="glass-stat-card completed">
                      <div className="stat-content">
                        <FaCheckCircle className="stat-icon" />
                        <div className="stat-info">
                          <h3>{appointmentHistory.filter(app => app.status === 'completed').length}</h3>
                          <span>Completed</span>
                        </div>
                      </div>
                      <div className="stat-progress">
                        <div className="progress-ring"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="glass-stat-card rejected">
                      <div className="stat-content">
                        <FaTimesCircle className="stat-icon" />
                        <div className="stat-info">
                          <h3>{appointmentHistory.filter(app => app.status === 'rejected').length}</h3>
                          <span>Rejected</span>
                        </div>
                      </div>
                      <div className="stat-progress">
                        <div className="progress-ring"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-grid">
                {appointmentHistory
                  .filter(app => 
                    app.status === 'pending' || 
                    app.status === 'completed' || 
                    app.status === 'rejected' || 
                    !app.status
                  )
                  .map((appointment, index) => (
                    <div 
                      key={index} 
                      className={`glass-appointment-card ${appointment.status || 'pending'}`}
                      onClick={() => handleAppointmentClick(appointment)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-status-indicator"></div>
                      <div className="card-header">
                        <div className="appointment-type">
                          <h5>{appointment.appointmentType}</h5>
                          {appointment.isCurrent && (
                            <span className="current-tag">Current</span>
                          )}
                        </div>
                        <div className={`status-badge ${appointment.status || 'pending'}`}>
                          {getStatusIcon(appointment.status)}
                          <span>{capitalizeFirstLetter(appointment.status || 'pending')}</span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="appointment-info">
                          <div className="info-item">
                            <FaCalendarAlt />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="info-item">
                            <FaClock />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        {appointment.message && (
                          <div className="message-box">
                            <FaCommentDots />
                            <p>{appointment.message}</p>
                          </div>
                        )}
                      </div>
                      {appointment.importedFile && (
                        <div className="imported-file-indicator">
                          <FaFileDownload className="me-2" />
                          <span>Medical Record Available</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="modal-footer glass-footer">
              <div className="total-items">
                <span>Total Appointments: </span>
                <strong>
                  {appointmentHistory.filter(app => 
                    app.status === 'pending' || 
                    app.status === 'completed' || 
                    app.status === 'rejected' || 
                    !app.status
                  ).length}
                </strong>
              </div>
              <button className="btn btn-close-modal" onClick={() => setShowHistoryModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showHistoryModal && <div className="modal-backdrop fade show" />}
      {/* File Preview Modal */}
      <div 
        className={`modal fade ${showFileModal ? 'show' : ''}`}
        style={{ display: showFileModal ? 'block' : 'none' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fileModalTitle"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {appointmentData?.importedFile?.name}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowFileModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {appointmentData?.importedFile?.url && 
                renderFilePreview(appointmentData.importedFile.url)
              }
            </div>
            <div className="modal-footer">
              <a 
                href={appointmentData?.importedFile?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Download
              </a>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowFileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showFileModal && <div className="modal-backdrop fade show" />}
      <div 
        className={`modal fade ${showAppointmentDetails ? 'show' : ''}`}
        style={{ display: showAppointmentDetails ? 'block' : 'none' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointmentDetailsTitle"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content glass-modal">
            <div className="modal-header glass-header">
              <div className="d-flex align-items-center">
                <div className="header-icon">
                  <FaCalendarAlt size={24} />
                </div>
                <div className="ms-3">
                  <h4 className="modal-title mb-0" id="appointmentDetailsTitle">
                    Appointment Details
                  </h4>
                  <small className="text-muted">{selectedAppointment?.appointmentType}</small>
                </div>
              </div>
              <button 
                className="btn-close"
                onClick={() => setShowAppointmentDetails(false)}
                aria-label="Close modal"
              ></button>
            </div>

            <div className="modal-body p-4">
              {selectedAppointment && (
                <div className="appointment-details-container">
                  <div className="status-section mb-4">
                    <div className={`status-indicator-large ${selectedAppointment.status || 'pending'}`}>
                      {getStatusIcon(selectedAppointment.status)}
                      <span>{capitalizeFirstLetter(selectedAppointment.status || 'pending')}</span>
                    </div>
                  </div>

                  <div className="patient-info-section">
                    <div className="detail-group">
                      <label>Patient Information</label>
                      <div className="patient-info-grid">
                        <div className="info-item">
                          <FaUser className="info-icon" />
                          <div className="info-content">
                            <span className="info-label">Name</span>
                            <span className="info-value">{selectedAppointment.name}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaEnvelope className="info-icon" />
                          <div className="info-content">
                            <span className="info-label">Email</span>
                            <span className="info-value">{selectedAppointment.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-group">
                      <label>Date & Time</label>
                      <div className="detail-content">
                        <FaCalendarAlt />
                        <span>{selectedAppointment.date}</span>
                        <FaClock className="ms-3" />
                        <span>{selectedAppointment.time}</span>
                      </div>
                    </div>

                    {selectedAppointment.selectedServices && (
                      <div className="detail-group">
                        <label>Selected Services</label>
                        <div className="services-list">
                          {selectedAppointment.selectedServices.map((service, index) => (
                            <div key={index} className="service-item-detail">
                              <div className="service-header">
                                <h6>{service.name}</h6>
                                <span className="price">
                                  ₱{service[selectedAppointment.selectedPricingType]?.toLocaleString()}
                                </span>
                              </div>
                              {service.isPackage && service.components && (
                                <div className="package-components">
                                  {service.components.map((component, idx) => (
                                    <div key={idx} className="component-item">
                                      <span>{component.name}</span>
                                      <span>₱{component[selectedAppointment.selectedPricingType]?.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          <div className="total-section">
                            <strong>Total Amount: </strong>
                            <span>₱{calculateTotal(selectedAppointment.selectedServices, selectedAppointment.selectedPricingType)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedAppointment.message && (
                      <div className="detail-group">
                        <label>Additional Message</label>
                        <div className="message-content">
                          <FaCommentDots />
                          <p>{selectedAppointment.message}</p>
                        </div>
                      </div>
                    )}

                    {selectedAppointment.remark && (
                      <div className="detail-group">
                        <label>Remark</label>
                        <div className="remark-content">
                          <FaComment />
                          <p>{selectedAppointment.remark}</p>
                        </div>
                      </div>
                    )}

                    {selectedAppointment?.importedFile && (
                      <div className="detail-group">
                        <label>Medical Record</label>
                        <div className="imported-file-section">
                          <div className="file-preview-card">
                            <div className="file-icon">
                              <FaFileDownload size={24} />
                            </div>
                            <div className="file-info">
                              <h6>{selectedAppointment.importedFile.name}</h6>
                              <div className="file-actions">
                                <button 
                                  className="btn btn-preview"
                                  onClick={() => handleFilePreview(selectedAppointment)}
                                >
                                  <FaEye className="me-2" />
                                  Preview
                                </button>
                                <a 
                                  href={selectedAppointment.importedFile.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-download"
                                >
                                  <FaFileDownload className="me-2" />
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer glass-footer">
              <button 
                className="btn btn-close-modal" 
                onClick={() => setShowAppointmentDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAppointmentDetails && <div className="modal-backdrop fade show" />}
      <div 
        className={`modal fade ${showImportedFileModal ? 'show' : ''}`}
        style={{ display: showImportedFileModal ? 'block' : 'none' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="importedFileModalTitle"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content glass-modal">
            <div className="modal-header glass-header">
              <div className="d-flex align-items-center">
                <div className="header-icon">
                  <FaFileDownload size={24} />
                </div>
                <div className="ms-3">
                  <h4 className="modal-title mb-0" id="importedFileModalTitle">
                    Medical Record
                  </h4>
                  <small className="text-muted">
                    {selectedAppointment?.importedFile?.name || 'No file name'}
                  </small>
                </div>
              </div>
              <button 
                className="btn-close"
                onClick={() => setShowImportedFileModal(false)}
                aria-label="Close modal"
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="file-preview-container">
                {selectedAppointment?.importedFile?.url ? (
                  renderFilePreview(selectedAppointment.importedFile.url)
                ) : (
                  <div className="text-center">
                    <p>No file preview available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer glass-footer">
              {selectedAppointment?.importedFile?.url && (
                <a 
                  href={selectedAppointment.importedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-download"
                >
                  <FaFileDownload className="me-2" />
                  Download File
                </a>
              )}
              <button 
                className="btn btn-close-modal" 
                onClick={() => setShowImportedFileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showImportedFileModal && <div className="modal-backdrop fade show" />}
      {(showAppointmentDetails || showImportedFileModal) && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => {
            setShowAppointmentDetails(false);
            setShowImportedFileModal(false);
          }}
        ></div>
      )}
     
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

function formatPricingType(type) {
  switch (type) {
    case 'withoutPH':
      return 'Without PhilHealth';
    case 'PHBenefit':
      return 'PhilHealth Benefit';
    case 'withPH':
      return 'With PhilHealth';
    default:
      return type;
  }
}

function calculateTotal(services, pricingType) {
  if (!services || !pricingType) return 0;
  return services.reduce((total, service) => total + (service[pricingType] || 0), 0).toLocaleString();
}

function getFileIcon(fileType) {
  if (fileType.includes('image')) {
    return <FaImage size={24} />;
  } else if (fileType.includes('pdf')) {
    return <FaFileDownload size={24} />;
  } else {
    return <FaFile size={24} />;
  }
}

function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default UserProfile;