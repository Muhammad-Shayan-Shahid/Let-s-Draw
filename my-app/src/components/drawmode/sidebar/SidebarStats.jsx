import React from 'react';

export const SidebarStats = ({ tool, brushSize, brushColor, eraserSize }) => {
  return (
    <div style={{ 
      padding: "16px", 
      backgroundColor: "rgba(55, 65, 81, 0.5)", 
      borderRadius: "10px",
      border: "1px solid #374151"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ color: "#d1d5db", fontSize: "14px" }}>Active Tool</span>
        <span style={{ 
          color: "#ec4899", 
          fontSize: "14px", 
          fontWeight: "700",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          padding: "4px 12px",
          borderRadius: "20px"
        }}>
          {tool === "brush" ? "Brush" : "Eraser"}
        </span>
      </div>
      
      <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span style={{ color: tool === "brush" ? "#ec4899" : "#6b7280" }}>●</span>
          <span>Brush: {brushSize}px • {brushColor}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <span style={{ color: tool === "eraser" ? "#ec4899" : "#6b7280" }}>●</span>
          <span>Eraser: {eraserSize}px</span>
        </div>
        <div style={{ padding: "8px", backgroundColor: "rgba(236, 72, 153, 0.1)", borderRadius: "6px", fontSize: "11px" }}>
          💡 Click and drag on canvas to draw
        </div>
      </div>
    </div>
  );
};