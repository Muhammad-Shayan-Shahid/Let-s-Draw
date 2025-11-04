import React from 'react';

export const ClearButton = ({ clearCanvas }) => {  // Changed from onClear to clearCanvas
  return (
    <button
      onClick={clearCanvas}
      style={{
        width: "100%",
        padding: "12px 16px",
        backgroundColor: "#6b7280",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "12px"
      }}
    >
      🗑️ Clear Canvas
    </button>
  );
};