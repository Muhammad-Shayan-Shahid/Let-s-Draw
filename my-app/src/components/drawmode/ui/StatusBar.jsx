import React from 'react';

export const StatusBar = ({ tool, brushSize, brushColor, eraserSize }) => {
  return (
    <div style={{
      position: "absolute",
      bottom: "16px",
      left: "16px",
      right: "16px",
      backgroundColor: "rgba(31, 41, 55, 0.95)",
      color: "#f9fafb",
      padding: "12px 16px",
      borderRadius: "10px",
      fontSize: "14px",
      border: "1px solid #374151",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      backdropFilter: "blur(10px)",
      zIndex: 50
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ 
          color: tool === "brush" ? "#ec4899" : "#6b7280",
          fontSize: "16px" 
        }}>
          {tool === "brush" ? "🖌️" : "🧹"}
        </span>
        <span>
          {tool === "brush" 
            ? `Drawing with ${brushSize}px brush • ${brushColor}` 
            : `Erasing with ${eraserSize}px eraser`
          } • Click and drag to {tool === "brush" ? "draw" : "erase"}
        </span>
      </div>
    </div>
  );
};