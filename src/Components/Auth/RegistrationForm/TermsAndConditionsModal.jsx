// TermsAndConditionsModal.jsx
import React from 'react';
import Modal from 'react-modal';

const TermsAndConditionsModal = ({ isOpen, onClose, onAgree }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Terms and Conditions"
      style={{
        content: {
          width: '40%',
          height: '85%',
          margin: 'auto',
          padding: '20px',
        },
      }}
    >
      <div>
        <h2>Terms and Conditions</h2>
        <p>Welcome to PlanItFamIt! By registering, you agree to the following terms:</p>
        
        <h3>Usage of PlanItFamIt</h3>
        <p>PlanItFamIt is a web app designed for family planning, provided by Team CODEXIA from Gordon College, in partnership with St. Margaret Lying In Clinic.</p>

        <h3>Intellectual Property</h3>
        <p>The code for this application is proprietary and protected by copyright law. Any unauthorized reproduction or distribution is punishable by law.</p>
        
        <h3>Limitations and Accuracy</h3>
        <ul>
          <li>Ovulation predictions by PlanItFamIt’s machine learning model have a 98% accuracy rate, but are subject to possible inaccuracies.</li>
          <li>Information from the PlanItAssistant (AI Chatbot) is kept up-to-date but should not replace professional medical advice.</li>
          <li>We strongly recommend seeking professional assistance for critical family planning decisions.</li>
        </ul>

        <h3>User Responsibilities</h3>
        <p>As a user of PlanItFamIt, you agree to:</p>
        <ul>
          <li>Provide accurate and truthful information to the best of your knowledge.</li>
          <li>Use the application in a responsible and respectful manner.</li>
          <li>Respect the intellectual property rights of PlanItFamIt and its developers.</li>
        </ul>

        <h3>Limitation of Liability</h3>
        <p>PlanItFamIt and its developers are not liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the application or any information provided herein. This includes, but is not limited to, decisions made based on the predictions and recommendations from PlanItFamIt’s machine learning model and PlanItAssistant.</p>

        <h3>Privacy and Data Security</h3>
        <p>We are committed to protecting your privacy and ensuring the security of your personal information. By using PlanItFamIt, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy. We implement various security measures to protect your personal data; however, we cannot guarantee its absolute security.</p>

        <h3>Changes to Terms and Conditions</h3>
        <p>PlanItFamIt reserves the right to modify these terms and conditions at any time. Any changes will be posted on our website, and it is your responsibility to review them periodically. Continued use of the application following any changes indicates your acceptance of the updated terms.</p>

        <h3>Contact Information</h3>
        <p>If you have any questions or concerns about these terms and conditions, please contact us at [Contact Email or Address].</p>

        <section className="flex_center">
          <button className="accept" onClick={() => { onAgree(); onClose(); }}>Agree and Close</button>
        </section>
      </div>
    </Modal>
  );
};

export default TermsAndConditionsModal;
