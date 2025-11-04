import {useState} from "react";
import { useCanvas } from './useCanvas';

export const useDrawing = () => {
  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [eraserSize, setEraserSize] = useState(20);

  const canvasProps = useCanvas({
    tool, 
    brushSize, 
    brushColor, 
    eraserSize
  });

  return {
    tool,
    setTool,
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    eraserSize,
    setEraserSize,
    ...canvasProps
  };
};