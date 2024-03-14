import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import airbean from '../../assets/airBeanLogo.svg';
function LandingPage() {
  
  return (
    <div className="landing-page">
        <Link to="/about">
        <img src={airbean} />
        </Link>
        <Link to="/about">
              <h1>AIRBEAN</h1>
              <p>DRONEDELIVERED COFFEE </p>
        </Link>
    
    
    </div>
  );
}

export default LandingPage;
