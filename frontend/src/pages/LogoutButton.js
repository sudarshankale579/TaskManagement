/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// LogoutButton.js
import React from 'react';

const LogoutButton = ({ onLogout }) => {
    return (
        <button onClick={onLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
