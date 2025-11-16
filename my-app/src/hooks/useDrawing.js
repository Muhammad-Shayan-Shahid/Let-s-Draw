import {useState,useEffect} from "react";
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case '1':
          setTool('brush');
          e.preventDefault();
          break;
        case '2':
          setTool('eraser');
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

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
