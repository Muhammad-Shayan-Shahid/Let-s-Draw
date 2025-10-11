// import React from "react";
// import { Stage } from "react-konva";
// import DrawMode from "./DrawMode";
// import TextMode from "./WriteMode";

// const CanvasContainer = ({ mode }) => {
//   return (
//     <Stage width={window.innerWidth} height={window.innerHeight - 80}>

//       <DrawMode active={mode === "freedraw"} />

//       {/* {mode === "shapes" && <ShapeLayer />} */}

//       {/* Text rendered only if in text mode */}
//       {mode === "text" && <TextMode />}
//     </Stage>
//   );
// };

// export default CanvasContainer;

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Circle, Line, Arrow, Transformer, Image } from 'react-konva';

const CanvasContainer = ({ activeModule }) => {
  // Refs
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const textareaRef = useRef(null);
  const imageRef = useRef(null);
  
  // Drawing state
  const isDrawing = useRef(false);
  const lastPos = useRef(null);

  // Canvas dimensions
  const CANVAS_WIDTH = 3000;
  const CANVAS_HEIGHT = 3000;

  // Single source of truth - all canvas elements
  const [elements, setElements] = useState({
    drawing: null, // Canvas image for drawing
    texts: [],
    shapes: []
  });

  // Mode-specific UI states (not element data)
  const [uiState, setUiState] = useState({
    // Draw mode UI
    tool: 'brush',
    brushSize: 5,
    brushColor: '#ffffff',
    eraserSize: 20,
    
    // Write mode UI  
    editingId: null,
    newText: '',
    fontSize: 20,
    fontFamily: 'Arial',
    textColor: '#ffffff',
    
    // Shape mode UI
    selectedShape: 'rectangle',
    shapeFillColor: '#3b82f6',
    shapeStrokeColor: '#ffffff',
    strokeWidth: 2
  });

  // Common UI state
  const [selectedId, setSelectedId] = useState(null);

  // Initialize drawing canvas
  const { canvas, context } = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const context = canvas.getContext('2d');
    context.fillStyle = '#111827';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = uiState.brushColor;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = uiState.brushSize;
    return { canvas, context };
  }, []);

  // Set initial drawing element
  useEffect(() => {
    setElements(prev => ({ ...prev, drawing: canvas }));
  }, [canvas]);

  // Update drawing context when UI changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = uiState.tool === 'eraser' ? '#111827' : uiState.brushColor;
      context.lineWidth = uiState.tool === 'eraser' ? uiState.eraserSize : uiState.brushSize;
      context.globalCompositeOperation = uiState.tool === 'eraser' ? 'destination-out' : 'source-over';
    }
  }, [uiState.tool, uiState.brushColor, uiState.brushSize, uiState.eraserSize, context]);

  // Transformer management
  useEffect(() => {
    if (selectedId && transformerRef.current && activeModule !== 'draw') {
      const stage = stageRef.current;
      const node = stage.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId, activeModule]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
        if (uiState.editingId) finishTextEditing();
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !uiState.editingId) {
        deleteSelectedElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, uiState.editingId]);

  // MODE-SPECIFIC EVENT HANDLERS

  // Draw Mode Handlers
  const handleDrawMouseDown = (e) => {
    isDrawing.current = true;
    lastPos.current = e.target.getStage().getPointerPosition();
  };

  const handleDrawMouseUp = () => {
    isDrawing.current = false;
  };

  const handleDrawMouseMove = (e) => {
    if (!isDrawing.current) return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    context.beginPath();
    context.moveTo(lastPos.current.x, lastPos.current.y);
    context.lineTo(pos.x, pos.y);
    context.closePath();
    context.stroke();

    lastPos.current = pos;
    imageRef.current.getLayer().batchDraw();
  };

  // Write Mode Handlers
  const handleWriteClick = (e) => {
    // Click on existing text - select it
    if (e.target.getClassName() !== 'Stage') {
      setSelectedId(e.target.attrs.id);
      return;
    }

    // Click on empty space - finish editing
    if (uiState.editingId) finishTextEditing();
  };

  const handleTextDblClick = (e) => {
    const id = e.target.attrs.id;
    const textObj = elements.texts.find((t) => t.id === id);
    
    if (textObj) {
      setUiState(prev => ({ ...prev, editingId: id, newText: textObj.text }));
      setSelectedId(id);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 10);
    }
  };

  // Shape Mode Handlers
  const handleShapeDblClick = (e) => {
    if (e.target.getClassName() !== 'Stage') return;
    addShape(e);
  };

  const handleShapeClick = (e) => {
    e.cancelBubble = true;
    setSelectedId(e.target.attrs.id);
  };

  // ELEMENT CREATION FUNCTIONS
  const addTextElement = () => {
    const stage = stageRef.current;
    const id = 'text_' + Date.now().toString();
    
    const newTextObj = {
      id,
      x: stage.width() / 2 - 100,
      y: stage.height() / 2 - 15,
      text: '',
      fontSize: uiState.fontSize,
      fontFamily: uiState.fontFamily,
      fill: uiState.textColor,
      width: 200,
      height: 30,
      rotation: 0,
    };

    setElements(prev => ({ ...prev, texts: [...prev.texts, newTextObj] }));
    setSelectedId(id);
    setUiState(prev => ({ ...prev, editingId: id, newText: '' }));
    
    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.focus();
    }, 10);
  };

  const addShape = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    const id = `shape_${Date.now()}`;

    const baseProps = {
      id,
      x: pos.x - 50,
      y: pos.y - 50,
      fill: uiState.shapeFillColor,
      stroke: uiState.shapeStrokeColor,
      strokeWidth: uiState.strokeWidth,
      draggable: true
    };

    let newShape;
    switch (uiState.selectedShape) {
      case 'rectangle':
        newShape = { ...baseProps, type: 'rect', width: 100, height: 80 };
        break;
      case 'circle':
        newShape = { ...baseProps, type: 'circle', radius: 50 };
        break;
      case 'line':
        newShape = { ...baseProps, type: 'line', points: [0, 0, 100, 0], fill: 'transparent' };
        break;
      case 'arrow':
        newShape = { ...baseProps, type: 'arrow', points: [0, 0, 100, 0] };
        break;
      default:
        return;
    }

    setElements(prev => ({ ...prev, shapes: [...prev.shapes, newShape] }));
    setSelectedId(id);
  };

  // COMMON ELEMENT FUNCTIONS
  const handleDragEnd = (e) => {
    const id = e.target.attrs.id;
    
    setElements(prev => ({
      ...prev,
      texts: prev.texts.map(t => 
        t.id === id ? { ...t, x: e.target.x(), y: e.target.y() } : t
      ),
      shapes: prev.shapes.map(shape => 
        shape.id === id ? { ...shape, x: e.target.x(), y: e.target.y() } : shape
      )
    }));
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.attrs.id;
    
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const updates = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation()
    };

    // Update text
    setElements(prev => ({
      ...prev,
      texts: prev.texts.map(t => 
        t.id === id ? { 
          ...t, 
          ...updates,
          width: Math.max(30, t.width * scaleX),
          height: Math.max(20, t.height * scaleY)
        } : t
      ),
      shapes: prev.shapes.map(shape => {
        if (shape.id !== id) return shape;
        
        if (shape.type === 'rect') {
          return {
            ...shape,
            ...updates,
            width: Math.max(5, shape.width * scaleX),
            height: Math.max(5, shape.height * scaleY)
          };
        } else if (shape.type === 'circle') {
          return {
            ...shape,
            ...updates,
            radius: Math.max(5, shape.radius * Math.max(scaleX, scaleY))
          };
        }
        return { ...shape, ...updates };
      })
    }));
  };

  const finishTextEditing = () => {
    if (uiState.editingId) {
      setElements(prev => ({
        ...prev,
        texts: prev.texts.map(t =>
          t.id === uiState.editingId ? { ...t, text: uiState.newText || 'Double click to edit' } : t
        )
      }));
    }
    setUiState(prev => ({ ...prev, editingId: null, newText: '' }));
  };

  const deleteSelectedElement = () => {
    if (!selectedId) return;
    
    setElements(prev => ({
      ...prev,
      texts: prev.texts.filter(t => t.id !== selectedId),
      shapes: prev.shapes.filter(shape => shape.id !== selectedId)
    }));
    setSelectedId(null);
  };

  const clearCanvas = () => {
    // Clear drawing
    context.fillStyle = '#111827';
    context.fillRect(0, 0, canvas.width, canvas.height);
    imageRef.current.getLayer().batchDraw();
    
    // Clear all elements
    setElements({ drawing: canvas, texts: [], shapes: [] });
    setSelectedId(null);
    setUiState(prev => ({ ...prev, editingId: null, newText: '' }));
  };

  // DYNAMIC EVENT HANDLERS BASED ON ACTIVE MODE
  const getStageEventHandlers = () => {
    switch (activeModule) {
      case 'draw':
        return {
          onMouseDown: handleDrawMouseDown,
          onMouseUp: handleDrawMouseUp,
          onMouseMove: handleDrawMouseMove
        };
      case 'write':
        return { onClick: handleWriteClick };
      case 'shapes':
        return { onDblClick: handleShapeDblClick };
      default:
        return {};
    }
  };

  // ELEMENT RENDERERS
  const renderText = (text) => (
    <Text
      key={text.id}
      id={text.id}
      text={text.text}
      x={text.x}
      y={text.y}
      fontSize={text.fontSize}
      fontFamily={text.fontFamily}
      fill={text.fill}
      width={text.width}
      height={text.height}
      rotation={text.rotation}
      draggable={activeModule === 'write' && !uiState.editingId}
      onDblClick={activeModule === 'write' ? handleTextDblClick : undefined}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      onClick={(e) => {
        e.cancelBubble = true;
        if (activeModule === 'write' && !uiState.editingId) {
          setSelectedId(text.id);
        }
      }}
    />
  );

const renderShape = (shape) => {
  const commonProps = {
    key: shape.id,
    id: shape.id,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    stroke: shape.stroke,
    strokeWidth: shape.strokeWidth,
    rotation: shape.rotation,
    draggable: activeModule === 'shapes',  // ✅ Fixed - no comma at end
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    onClick: activeModule === 'shapes' ? handleShapeClick : undefined
  };  // ✅ Proper object syntax

    switch (shape.type) {
      case 'rect':
        return <Rect {...commonProps} width={shape.width} height={shape.height} />;
      case 'circle':
        return <Circle {...commonProps} radius={shape.radius} />;
      case 'line':
        return <Line {...commonProps} points={shape.points} />;
      case 'arrow':
        return <Arrow {...commonProps} points={shape.points} pointerLength={10} pointerWidth={10} />;
      default:
        return null;
    }
  };

  // Textarea positioning
  const getTextareaPosition = () => {
    if (!uiState.editingId) return { display: 'none' };
    
    const textObj = elements.texts.find((t) => t.id === uiState.editingId);
    if (!textObj) return { display: 'none' };

    const stageContainer = stageRef.current.container();
    const stageRect = stageContainer.getBoundingClientRect();
    
    return {
      position: "fixed",
      top: stageRect.top + textObj.y + "px",
      left: stageRect.left + textObj.x + "px",
      width: textObj.width + "px",
      minHeight: textObj.height + "px",
      fontSize: textObj.fontSize + "px",
      fontFamily: textObj.fontFamily,
      color: textObj.fill,
      border: "2px dashed #15803d",
      background: "#262626",
      outline: "none",
      resize: "none",
      padding: "4px",
      margin: 0,
      transform: `rotate(${textObj.rotation}deg)`,
      transformOrigin: "top left",
      zIndex: 1000,
      boxSizing: "border-box"
    };
  };

  // Export state for sidebar
  const canvasState = {
    elements,
    uiState,
    setUiState,
    selectedId,
    setSelectedId,
    addTextElement,
    clearCanvas,
    deleteSelectedElement
  };

  return {
    canvasState,
    render: (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#111827" }}>
        {/* Canvas Area */}
        <div style={{ flex: 1, position: "relative", backgroundColor: "#111827", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <Stage
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              ref={stageRef}
              {...getStageEventHandlers()}
            >
              <Layer>
                {/* Drawing Canvas */}
                {elements.drawing && <Image ref={imageRef} image={elements.drawing} x={0} y={0} />}
                
                {/* All Texts */}
                {elements.texts.map(renderText)}
                
                {/* All Shapes */}
                {elements.shapes.map(renderShape)}
                
                {/* Transformer (not in draw mode) */}
                {selectedId && activeModule !== 'draw' && !uiState.editingId && (
                  <Transformer ref={transformerRef} />
                )}
              </Layer>
            </Stage>
          </div>

          {/* Text Editing (Write Mode only) */}
          {activeModule === 'write' && (
            <textarea
              ref={textareaRef}
              value={uiState.newText}
              onChange={(e) => setUiState(prev => ({ ...prev, newText: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  finishTextEditing();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  finishTextEditing();
                }
              }}
              onBlur={() => setTimeout(finishTextEditing, 100)}
              style={getTextareaPosition()}
              placeholder="Type your text here..."
            />
          )}

          {/* Status Bar */}
          <div style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            backgroundColor: "rgba(31, 41, 55, 0.95)",
            color: "#f9fafb",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            border: "1px solid #374151",
            backdropFilter: "blur(10px)"
          }}>
            {activeModule === 'draw' && `Drawing Mode • ${uiState.tool === 'brush' ? `Brush: ${uiState.brushSize}px` : `Eraser: ${uiState.eraserSize}px`}`}
            {activeModule === 'write' && `Write Mode • ${uiState.editingId ? 'Editing text' : 'Ready to add text'}`}
            {activeModule === 'shapes' && `Shape Mode • ${selectedId ? 'Shape selected' : 'Double-click to add shapes'}`}
          </div>
        </div>
      </div>
    )
  };
};

export default CanvasContainer;
