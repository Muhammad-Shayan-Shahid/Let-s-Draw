import React from 'react';
import { useDrawing } from '../../hooks/useDrawing';
import { ToolSidebar } from './sidebar/ToolSidebar';
import { DrawingCanvas } from './canvas/DrawingCanvas';
import { StatusBar } from './ui/StatusBar';

const DrawMode = () => {
  const drawingProps = useDrawing();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#111827" }}>
      <ToolSidebar {...drawingProps} />
      
      <div style={{ 
        flex: 1, 
        position: "relative", 
        backgroundColor: "#111827",
        overflow: "hidden"
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          position: "relative"
        }}>
          <DrawingCanvas {...drawingProps} />
        </div>
        <StatusBar {...drawingProps} />
      </div>
    </div>
  );
};

export default DrawMode;