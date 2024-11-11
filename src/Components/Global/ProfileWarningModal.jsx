// ProfileWarningModal.jsx
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';

function ProfileWarningModal({ show, onClose }) {
  const { currentUser } = useAuth();
  const [daysLeft, setDaysLeft] = useState(14);

  useEffect(() => {
    const checkProfileStatus = async () => {
      const db = getFirestore();
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        
        if (data.isProfileComplete) {
          onClose(); // Close the modal if profile is complete
          return;
        }
  
        const registrationDate = data.registrationDate.toDate();
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - registrationDate);
        const diffDays = 14 - Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
        setDaysLeft(diffDays);
      }
    };
  
    if (currentUser) {
      checkProfileStatus();
    }
  }, [currentUser, onClose]);
  
  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Complete Your Profile</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>
              You have <strong>{daysLeft} days</strong> left to complete your profile. Please update your details to avoid account suspension.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={() => (window.location.href = '/UserProfile')}>
              Go to Profile
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileWarningModal;
