// import React from "react";
// import { Circle } from "react-konva";

// const EraserCursor = ({ position, size, isVisible }) => {
//   if (!isVisible || !position) return null;

//   return (
//     <Circle
//       x={position.x}
//       y={position.y}
//       radius={size / 2}
//       stroke="#8b5cf6"
//       strokeWidth={2}
//       fill="#ec4899"
//       dash={[5, 5]}
//       listening={false}
//       globalCompositeOperation="source-over"
//     />
//   );
// };

// export default EraserCursor;




import React from "react";
import { Circle } from "react-konva";

const EraserCursor = ({ position, size, isVisible }) => {
  if (!isVisible || !position) return null;

  return (
    <>
      {/* Main eraser area - ALWAYS visible */}
      <Circle
        x={position.x}
        y={position.y}
        radius={size / 2}
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth={2}
        fill="rgba(255, 255, 255, 0.1)"
        dash={[4, 4]}
        listening={false}
        globalCompositeOperation="source-over"
      />
      
      {/* Outer glow for better visibility */}
      <Circle
        x={position.x}
        y={position.y}
        radius={size / 2 + 2}
        stroke="rgba(139, 92, 246, 0.6)"
        strokeWidth={1}
        fillEnabled={false}
        listening={false}
        globalCompositeOperation="source-over"
      />
      
      {/* Center dot */}
      <Circle
        x={position.x}
        y={position.y}
        radius={2}
        fill="#ec4899"
        listening={false}
        globalCompositeOperation="source-over"
      />
    </>
  );
};

export default EraserCursor;

