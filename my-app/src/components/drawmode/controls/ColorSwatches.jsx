import React from 'react';

export const ColorSwatches = ({ colors, selectedColor, onColorSelect }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            backgroundColor: color,
            border: `3px solid ${selectedColor === color ? "#ec4899" : "#4b5563"}`,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        />
      ))}
    </div>
  );
};