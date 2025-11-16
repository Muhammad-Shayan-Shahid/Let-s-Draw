import React from 'react';

export const ClearButton = ({ clearCanvas }) => {  
  return (
    <button
      onClick={clearCanvas}
      style={{
        width: "100%",
        padding: "10px",
        backgroundColor: "#e33333ff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
      }}
    >
      🗑️ Clear Canvas
    </button>
  );
};