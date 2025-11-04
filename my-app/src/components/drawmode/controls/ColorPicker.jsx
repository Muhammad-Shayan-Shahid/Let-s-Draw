import React from 'react';
import { ColorSwatches } from './ColorSwatches';
import { BRUSH_COLORS } from '../../../constants/drawing';

export const ColorPicker = ({ selectedColor, onColorChange }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", marginBottom: "12px", display: "block" }}>
        Brush Color
      </label>
      
      <ColorSwatches 
        colors={BRUSH_COLORS}
        selectedColor={selectedColor}
        onColorSelect={onColorChange}
      />
      
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          style={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "8px",
            border: "2px solid #4b5563",
            cursor: "pointer"
          }}
        />
        <div style={{ 
          padding: "8px 12px", 
          backgroundColor: "#374151",
          border: "1px solid #4b5563",
          borderRadius: "6px",
          color: "#d1d5db",
          fontSize: "12px",
          fontFamily: "monospace"
        }}>
          {selectedColor}
        </div>
      </div>
    </div>
  );
};