import React from "react";
import { Stage, Layer, Image } from "react-konva";

const DrawMode = () => {

  // const [tool, setTool] = React.useState("brush");
  const isDrawing = React.useRef(false);
  const imageRef = React.useRef(null);
  const lastPos = React.useRef(null);

  const { canvas, context } = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 25;
    const context = canvas.getContext("2d");
    context.fillStyle = "#262626"; 
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#ffffff";
    context.lineJoin = "round";
    context.lineWidth = 5;
    return { canvas, context };
  }, []);


  const handleMouseDown = (e) => {
    isDrawing.current = true;
    lastPos.current = e.target.getStage().getPointerPosition();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const image = imageRef.current;
    const stage = e.target.getStage();

    context.globalCompositeOperation =
      // tool === "eraser" ? "destination-out" : "source-over";
    context.beginPath();

    const localPos = {
      x: lastPos.current.x - image.x(),
      y: lastPos.current.y - image.y(),
    };
    context.moveTo(localPos.x, localPos.y);

    const pos = stage.getPointerPosition();
    const newLocalPos = {
      x: pos.x - image.x(),
      y: pos.y - image.y(),
    };
    context.lineTo(newLocalPos.x, newLocalPos.y);
    context.closePath();
    context.stroke();

    lastPos.current = pos;
    image.getLayer().batchDraw();
  };

  return (
    <>
      {/* <select value={tool} onChange={(e) => setTool(e.target.value)}>
        <option value="brush">Brush</option>
        <option value="eraser">Eraser</option>
      </select> */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 25}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          <Image ref={imageRef} image={canvas} x={0} y={0} />
        </Layer>
      </Stage>
    </>
  );
};

export default DrawMode;
