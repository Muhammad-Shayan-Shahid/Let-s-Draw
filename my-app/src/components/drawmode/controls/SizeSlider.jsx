import React from 'react';

export const SizeSlider = ({ value, onChange, min, max, label, unit }) => {
  return (
    <div style={{ marginBottom: "5px" , }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500" }}>{label}</label>
        <span style={{ color: "#ec4899", fontSize: "14px", fontWeight: "600" }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: "#374151" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ color: "#9ca3af", fontSize: "12px" }}>{min}{unit}</span>
        <span style={{ color: "#9ca3af", fontSize: "12px" }}>{max}{unit}</span>
      </div>
    </div>
  );
};