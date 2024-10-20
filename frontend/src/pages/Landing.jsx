/* eslint-disable no-unused-vars */
import React from 'react'
import "../styles/Landing.css";
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='landing-main'>
    <h1> Task Management System</h1>

    <Link to="/login" className="landing-login-button">Login</Link>
    <Link to="/register" className="landing-register-button">Register</Link>
  </div>
  )
}

export default Landing