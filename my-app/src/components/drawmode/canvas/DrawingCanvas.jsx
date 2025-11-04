import React from "react";
import { Stage, Layer, Image } from "react-konva";
import { CANVAS_SIZE } from '../../../constants/drawing';

export const DrawingCanvas = ({ 
  canvas, 
  stageRef, 
  layerRef,
  handleMouseDown, 
  handleMouseMove, 
  handleMouseUp 
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#111827'
    }}>
      <Stage
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: 'crosshair'
        }}
      >
        <Layer ref={layerRef}>
          <Image 
            image={canvas} 
            x={0} 
            y={0}
          />
        </Layer>
      </Stage>
    </div>
  );
};