import React from 'react';
import { SizeSlider } from '../controls/SizeSlider';
import { ColorPicker } from '../controls/ColorPicker';

export const BrushControls = ({ brushSize, setBrushSize, brushColor, setBrushColor }) => {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
        Brush Settings
      </h4>
      
      <SizeSlider
        value={brushSize}
        onChange={setBrushSize}
        min={1}
        max={50}
        label="Brush Size"
        unit="px"
      />

      <ColorPicker
        selectedColor={brushColor}
        onColorChange={setBrushColor}
      />
    </div>
  );
};