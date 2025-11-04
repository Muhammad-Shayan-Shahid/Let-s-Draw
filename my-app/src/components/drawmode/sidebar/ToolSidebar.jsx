import React from 'react';
import { ToolSelection } from './ToolSelection';
import { BrushControls } from './BrushControls';
import { EraserControls } from './EraserControls';
import { SidebarStats } from './SidebarStats';
import { ClearButton } from '../controls/ClearButton';

export const ToolSidebar = (props) => {
  const { tool, clearCanvas } = props;

  return (
    <div style={{ 
      width: "280px", 
      backgroundColor: "#1f2937",
      borderRight: "1px solid #374151",
      overflow: "auto",
      boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
      position: "sticky",
      top: 0,
      left: 0,
      height: "100vh",
      zIndex: 100
    }}>
      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ 
            color: "#f9fafb", 
            fontSize: "20px", 
            fontWeight: "700",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Draw Mode
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
            Freehand drawing tools
          </p>
        </div>

        <ToolSelection {...props} />
        
        {tool === "brush" && <BrushControls {...props} />}
        {tool === "eraser" && <EraserControls {...props} />}
        
        <div style={{ marginBottom: "28px" }}>
          <ClearButton clearCanvas={clearCanvas} /> 
        </div>

        <SidebarStats {...props} />
      </div>
    </div>
  );
};