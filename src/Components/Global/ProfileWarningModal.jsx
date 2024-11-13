// ProfileWarningModal.jsx
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import './ProfileWarningModal.css';

const ProfileWarningModal = ({ show, onClose }) => {
  const { currentUser } = useAuth();
  const [daysLeft, setDaysLeft] = useState(14);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!currentUser) return;
      
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        
        // Check if all required fields are filled
        const profileComplete = Boolean(
          data.name?.trim() && 
          data.phone?.trim() && 
          data.age && 
          data.gender?.trim() && 
          data.location?.trim()
        );

        setIsProfileComplete(profileComplete);

        // If profile is complete, close the modal and update Firestore
        if (profileComplete) {
          onClose();
          if (data.isProfileComplete !== profileComplete) {
            await updateDoc(userRef, {
              isProfileComplete: profileComplete
            });
          }
          return;
        }
  
        // Only calculate days left if profile is incomplete
        if (!profileComplete && data.registrationDate && typeof data.registrationDate.toDate === 'function') {
          const registrationDate = data.registrationDate.toDate();
          const currentDate = new Date();
          const diffTime = Math.abs(currentDate - registrationDate);
          const diffDays = 14 - Math.floor(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(Math.max(0, diffDays));
        }
      }
    };
  
    if (currentUser) {
      // Initial check
      checkProfileStatus();

      // Set up real-time listener
      const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const complete = Boolean(
            data.name?.trim() && 
            data.phone?.trim() && 
            data.age && 
            data.gender?.trim() && 
            data.location?.trim()
          );
          
          setIsProfileComplete(complete);
          if (complete) {
            onClose();
          }
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser, onClose, db]);
  
  // Don't render the modal if profile is complete
  if (isProfileComplete) {
    return null;
  }

  // Only render if show is true and profile is incomplete
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop show" onClick={onClose}></div>
      <div className="profile-warning-modal show" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-exclamation-circle warning-icon"></i>
                Complete Your Profile
              </h5>
              <button type="button" className="close-button" onClick={onClose} aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-message">
                <div className="days-counter">
                  <span className="days-number">{daysLeft}</span>
                  <span className="days-text">days left</span>
                </div>
                <p className="message-text">
                  Your profile is incomplete. Please update your details to ensure
                  uninterrupted access to all features.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-complete-profile"
                onClick={() => (window.location.href = '/UserProfile')}
              >
                Complete Profile Now
              </button>
              <button 
                type="button" 
                className="btn-remind-later" 
                onClick={onClose}
              >
                Remind Me Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileWarningModal;
