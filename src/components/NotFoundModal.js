import React from "react";

const NotFoundModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <p style={{color:'red'}}>I didn't find city</p>
      </div>
    </div>
  );
};

export default NotFoundModal;
