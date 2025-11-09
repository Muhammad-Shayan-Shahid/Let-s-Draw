import React from "react";
import { Stage, Layer, Image } from "react-konva";
import { CANVAS_SIZE } from '../../../constants/drawing';
import EraserCursor from './EraserCursor';

export const DrawingCanvas = ({ 
  canvas, 
  stageRef, 
  layerRef,
  handleMouseDown, 
  handleMouseMove, 
  handleMouseLeave,
  handleMouseUp,
  tool,
  eraserSize,
  cursorPosition,
  isCursorVisible,
  stagePosition
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#111827',
      cursor: tool === 'eraser' ? 'none' : 'crosshair'
    }}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={false}
        style={{
          // Ensure stage covers entire viewport
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {/* Main canvas layer */}
        <Layer ref={layerRef}>
          <Image 
            image={canvas} 
            x={0} 
            y={0}
            width={CANVAS_SIZE.width}
            height={CANVAS_SIZE.height}
            listening={false} // Don't block events
          />
        </Layer>
        
        {/* Cursor layer - ALWAYS on top */}
        <Layer>
          <EraserCursor 
            position={cursorPosition} // Use absolute coordinates
            size={eraserSize}
            isVisible={isCursorVisible && tool === 'eraser'}
          />
        </Layer>
      </Stage>
    </div>
  );
};