import React from 'react';

export const ToolButton = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "16px 12px",
        backgroundColor: active ? "#374151" : "transparent",
        border: `2px solid ${active ? "#ec4899" : "#4b5563"}`,
        borderRadius: "10px",
        color: active ? "#f9fafb" : "#9ca3af",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <span style={{ fontSize: "24px" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};
