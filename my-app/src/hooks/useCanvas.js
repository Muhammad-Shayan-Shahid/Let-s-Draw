import { useRef, useMemo, useEffect, useCallback, useState } from "react";
import { CANVAS_SIZE } from '../constants/drawing';

export const useCanvas = ({ tool, brushSize, brushColor, eraserSize }) => {
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const lastPointerPosition = useRef(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  // Create canvas and context
  const { canvas, context } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;
    const context = canvas.getContext("2d");
    
    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = brushColor;
    
    return { canvas, context };
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === "eraser" ? "#111827" : brushColor;
      context.lineWidth = tool === "eraser" ? eraserSize : brushSize;
      context.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    }
  }, [tool, brushColor, brushSize, eraserSize, context]);

  // Get absolute canvas coordinates (accounts for panning)
  const getAbsolutePosition = useCallback((stageX, stageY) => {
    return {
      x: stageX - stagePosition.x,
      y: stageY - stagePosition.y
    };
  }, [stagePosition]);

  const handleMouseDown = useCallback((e) => {
    const isMiddleButton = e.evt.button === 1;
    const isSpacePressed = e.evt.shiftKey;
    
    if (isMiddleButton || isSpacePressed) {
      isPanning.current = true;
      lastPointerPosition.current = { x: e.evt.clientX, y: e.evt.clientY };
      document.body.style.cursor = 'grabbing';
      return;
    }

    // Start drawing - use absolute coordinates
    if (tool !== 'pan') {
      isDrawing.current = true;
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      
      if (pos) {
        const absolutePos = getAbsolutePosition(pos.x, pos.y);
        
        context.beginPath();
        context.moveTo(absolutePos.x, absolutePos.y);
        // Draw initial point
        context.lineTo(absolutePos.x, absolutePos.y);
        context.stroke();
        layerRef.current.batchDraw();
      }
    }
  }, [context, tool, getAbsolutePosition]);

  const handleMouseMove = useCallback((e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    
    if (!pos) return;

    // Update cursor position (absolute coordinates for eraser cursor)
    const absolutePos = getAbsolutePosition(pos.x, pos.y);
    setCursorPosition(absolutePos);
    
    if (tool === 'eraser') {
      setIsCursorVisible(true);
    }

    // Handle panning
    if (isPanning.current && lastPointerPosition.current) {
      const dx = e.evt.clientX - lastPointerPosition.current.x;
      const dy = e.evt.clientY - lastPointerPosition.current.y;
      
      setStagePosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      lastPointerPosition.current = { x: e.evt.clientX, y: e.evt.clientY };
      return;
    }

    // Handle drawing - use absolute coordinates
    if (isDrawing.current) {
      const absolutePos = getAbsolutePosition(pos.x, pos.y);
      
      context.lineTo(absolutePos.x, absolutePos.y);
      context.stroke();
      layerRef.current.batchDraw();
    }
  }, [context, tool, getAbsolutePosition]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
    isPanning.current = false;
    lastPointerPosition.current = null;
    document.body.style.cursor = tool === 'eraser' ? 'none' : 'crosshair';
    if (context) {
      context.closePath();
    }
  }, [context, tool]);

  const handleMouseLeave = useCallback(() => {
    setIsCursorVisible(false);
  }, []);

  const resetView = useCallback(() => {
    setStagePosition({ x: 0, y: 0 });
  }, []);

  const clearCanvas = useCallback(() => {
    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);
    layerRef.current.batchDraw();
  }, [context, canvas]);

  return {
    canvas,
    context,
    stageRef,
    layerRef,
    cursorPosition,
    isCursorVisible,
    stagePosition,
    setStagePosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseLeave,
    handleMouseUp,
    resetView,
    clearCanvas
  };
};