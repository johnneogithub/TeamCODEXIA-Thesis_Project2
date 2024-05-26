import { Margin, Padding } from '@mui/icons-material';
import React from 'react';

import './FooterStyle.css';

const Footer = () => {
  return (
      <footer style={{backgroundColor: '#ffff', borderColor: '#81088', borderTop: '1px solid #81088', position: 'relative', bottom: '0', width: '100%'}}>
        <div className="container p-7">
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <h1 className="mb-3" style={{letterSpacing: '0px', color: '#520057', textAlign: 'justify'}}>PlanItFamIt </h1>
              <p style={{textAlign: 'justify'}}>
                PlanItFamIt your guide to family planning!<br/>
                Developed by Team CODEXIA from Gordon College CCS department. <br/>
                With development partner St. Margaret Lying In Clinic.
              </p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h3 className="mb-3" style={{letterSpacing: '0px', color: '#520057', textAlign: 'justify'}}>Explore</h3>
              <ul className="list-unstyled mb-0" style={{ textAlign: 'justify', Padding: '10px'}}>
                <li className="mb-1">
                  <a href="/Home" style={{color: '#810088'}}>Home</a>
                </li>
                <li className="mb-1">
                  <a href="/Chatbot" style={{color: '#810088'}}>PlanIt Assistant</a>
                </li>
                <li className="mb-1">
                  <a href="/Articles" style={{color: '#810088'}}>Articles</a>
                </li>
                <li>
                  <a href="/Type" style={{color: '#810088'}}>St. Margaret Lying In Clinic</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h3 className="mb-3" style={{letterSpacing: '0px', color: '#520057', textAlign: 'justify'}}>Clinic Information:</h3>
              <ul className="list-unstyled mb-0" style={{ textAlign: 'justify', Padding: '10px'}}>
                <li className="mb-1">
                  <a href="/Home" style={{color: '#810088'}}>Page · Pregnancy Care Center</a>
                </li>
                <li className="mb-1">
                  <a href="/Chatbot" style={{color: '#810088'}}>GF 74A 20TH ST. EAST BAJAC BAJAC, Olongapo, Philippines</a>
                </li>
                <li className="mb-1">
                  <a href="/Articles" style={{color: '#810088'}}>0968 240 5533</a>
                </li>
                <li>
                  <a href="/Type" style={{color: '#810088'}}>St. Margaret Lying In Clinic</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h3 className="mb-1" style={{letterSpacing: '0px', color: '#520057', textAlign: 'left'}}>Clinic's Open Hours</h3>
              <table className="table" style={{color: '#520057', borderColor: '#666'}}>
                <tbody>
                  <tr>
                    <td>Mon - Fri:</td>
                    <td>8am - 5pm</td>
                  </tr>
                  <tr>
                    <td>Sat - Sun:</td>
                    <td>8am - 4pm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="text-center p-3 color-white" style={{backgroundColor: 'rgb(197, 87, 219)', fontSize: '20px'}}>
          © 2024 Copyright:
          <a className="text-white" href="/#" style={{ letterSpacing: '1px', paddingLeft: '10px'}}>PlanItFamIt.com</a>
        </div>
      </footer>
  );
};

export default Footer;
