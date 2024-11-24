import React from 'react';
import { FaUser } from 'react-icons/fa';

function AppointmentHistoryModal({ 
  showModal, 
  onClose, 
  appointmentHistory,
  getStatusBadgeClass,
  capitalizeFirstLetter 
}) {
  return (
    <>
      <div className={`modal fade ${showModal ? 'show' : ''}`} 
        style={{ display: showModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Appointment History</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="appointment-history-list modal-history-list">
                {appointmentHistory.map((appointment, index) => (
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
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

export default AppointmentHistoryModal; 