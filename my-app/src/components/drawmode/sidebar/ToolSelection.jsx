import React from 'react';
import { ToolButton } from '../ui/ToolButton';

export const ToolSelection = ({ tool, setTool }) => {
  return (
    <div style={{ marginBottom: "32px" }}>
      {/* <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
        Tools
      </h4> */}
      <div style={{ display: "flex", gap: "12px" }}>
        <ToolButton
          active={tool === "brush"}
          onClick={() => setTool("brush")}
          icon="🖌️"
          label="Brush"
        />
        <ToolButton
          active={tool === "eraser"}
          onClick={() => setTool("eraser")}
          icon="🧹"
          label="Eraser"
        />
      </div>
    </div>
  );
};