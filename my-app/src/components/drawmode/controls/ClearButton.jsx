import React from 'react';

export const ClearButton = ({ clearCanvas }) => {  
  return (
    <button
      onClick={clearCanvas}
      style={{
        width: "100%",
        padding: "12px 12px",
        backgroundColor: "#e33333ff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
        marginBottom: "20px",
      }}
    >
      🗑️ Clear Canvas
    </button>
  );
};