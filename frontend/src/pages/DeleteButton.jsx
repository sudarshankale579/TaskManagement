/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// DeleteButton.js
import React from 'react';

const DeleteButton = ({ data, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      onDelete(data._id);
    }
  };

  return (
    <button className="delete-button" onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DeleteButton;
