import React from 'react';
import { SizeSlider } from '../controls/SizeSlider';

export const EraserControls = ({ eraserSize, setEraserSize }) => {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
        Eraser Settings
      </h4>
      
      <SizeSlider
        value={eraserSize}
        onChange={setEraserSize}
        min={5}
        max={100}
        label="Eraser Size"
        unit="px"
      />
    </div>
  );
};