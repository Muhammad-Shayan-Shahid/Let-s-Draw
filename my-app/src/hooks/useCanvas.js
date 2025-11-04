import { useRef, useMemo, useEffect, useCallback } from "react";

const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 3000;

export const useCanvas = ({ tool, brushSize, brushColor, eraserSize }) => {
  const isDrawing = useRef(false);
  const lastPos = useRef(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  // Create canvas and context
  const { canvas, context } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const context = canvas.getContext("2d");
    
    // Initialize canvas with dark background
    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = brushColor;
    
    return { canvas, context };
  }, []);

  // Update context when properties change
  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === "eraser" ? "#111827" : brushColor;
      context.lineWidth = tool === "eraser" ? eraserSize : brushSize;
      context.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    }
  }, [tool, brushColor, brushSize, eraserSize, context]);

  const handleMouseDown = useCallback((e) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    lastPos.current = pos;

    // Start drawing path
    context.beginPath();
    context.moveTo(pos.x, pos.y);
  }, [context]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing.current || !lastPos.current) return;

    const stage = e.target.getStage();
    const currentPos = stage.getPointerPosition();

    // Draw line
    context.lineTo(currentPos.x, currentPos.y);
    context.stroke();

    // Update last position
    lastPos.current = currentPos;

    // Force redraw
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [context]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
    context.closePath();
  }, [context]);

  const clearCanvas = useCallback(() => {
    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [context, canvas]);

  return {
    canvas,
    context,
    stageRef,
    layerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas
  };
};