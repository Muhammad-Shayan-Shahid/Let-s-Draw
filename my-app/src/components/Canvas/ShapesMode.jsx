import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Arrow, Transformer } from "react-konva";

const ShapeMode = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  const shapeTypes = [
    { id: "rectangle", name: "Rectangle", icon: "⬜" },
    { id: "circle", name: "Circle", icon: "⭕" },
    { id: "square", name: "Square", icon: "□" },
    { id: "line", name: "Line", icon: "📏" },
    { id: "arrow", name: "Arrow", icon: "➡️" },
    { id: "triangle", name: "Triangle", icon: "🔺" },
    { id: "star", name: "Star", icon: "⭐" },
    { id: "heart", name: "Heart", icon: "❤️" }
  ];

  // Handle stage double click to add shapes
  const handleStageDblClick = (e) => {
    // Don't add shape if double-clicked on existing shape
    if (e.target.getClassName() !== "Stage") {
      return;
    }

    // Add new shape on double-click
    const pos = e.target.getPointerPosition();
    const id = `shape_${Date.now()}`;

    let newShape;
    const baseProps = {
      id,
      x: pos.x - 50,
      y: pos.y - 50,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      draggable: true
    };

    switch (selectedShape) {
      case "rectangle":
        newShape = {
          ...baseProps,
          type: "rect",
          width: 100,
          height: 80
        };
        break;
      case "circle":
        newShape = {
          ...baseProps,
          type: "circle",
          radius: 50
        };
        break;
      case "square":
        newShape = {
          ...baseProps,
          type: "rect",
          width: 80,
          height: 80
        };
        break;
      case "line":
        newShape = {
          ...baseProps,
          type: "line",
          points: [0, 0, 100, 0],
          fill: "transparent"
        };
        break;
      case "arrow":
        newShape = {
          ...baseProps,
          type: "arrow",
          points: [0, 0, 100, 0],
          fill: strokeColor,
          stroke: strokeColor
        };
        break;
      case "triangle":
        newShape = {
          ...baseProps,
          type: "line",
          points: [50, 0, 0, 100, 100, 100, 50, 0],
          closed: true
        };
        break;
      case "star":
        newShape = {
          ...baseProps,
          type: "line",
          points: [50, 0, 61, 35, 98, 35, 68, 57, 79, 91, 50, 70, 21, 91, 32, 57, 2, 35, 39, 35, 50, 0],
          closed: true
        };
        break;
      case "heart":
        newShape = {
          ...baseProps,
          type: "line",
          points: [50, 20, 60, 10, 70, 20, 80, 30, 70, 50, 50, 70, 30, 50, 20, 30, 30, 20, 40, 10, 50, 20],
          closed: true,
          tension: 0.5
        };
        break;
      default:
        return;
    }

    setShapes([...shapes, newShape]);
    setSelectedId(id);
  };

  // Handle single click - only for selection
  const handleStageClick = (e) => {
    // If clicked on existing shape, select it
    if (e.target.getClassName() !== "Stage") {
      setSelectedId(e.target.attrs.id);
      return;
    }

    // If clicked on empty space, do nothing (just deselect)
    setSelectedId(null);
  };

  // Handle shape drag end
  const handleDragEnd = (e) => {
    const id = e.target.attrs.id;
    setShapes(prev =>
      prev.map(shape =>
        shape.id === id
          ? { ...shape, x: e.target.x(), y: e.target.y() }
          : shape
      )
    );
  };

  // Handle shape transformation
  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.attrs.id;
    const shape = shapes.find(s => s.id === id);

    if (!shape) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    let updates = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation()
    };

    if (shape.type === "rect") {
      updates = {
        ...updates,
        width: Math.max(5, shape.width * scaleX),
        height: Math.max(5, shape.height * scaleY)
      };
    } else if (shape.type === "circle") {
      const newRadius = Math.max(5, shape.radius * Math.max(scaleX, scaleY));
      updates = { ...updates, radius: newRadius };
    } else if (shape.type === "line" || shape.type === "arrow") {
      const scale = Math.max(scaleX, scaleY);
      const newPoints = shape.points.map(point => point * scale);
      updates = { ...updates, points: newPoints };
    }

    setShapes(prev =>
      prev.map(s =>
        s.id === id ? { ...s, ...updates } : s
      )
    );
  };

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedId && transformerRef.current) {
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
  }, [selectedId]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
      
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        setShapes(prev => prev.filter(shape => shape.id !== selectedId));
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  // Update shape properties when controls change
  useEffect(() => {
    if (selectedId) {
      setShapes(prev =>
        prev.map(shape =>
          shape.id === selectedId
            ? { ...shape, fill: fillColor, stroke: strokeColor, strokeWidth: strokeWidth }
            : shape
        )
      );
    }
  }, [fillColor, strokeColor, strokeWidth, selectedId]);

  // Render shape based on type
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
      draggable: true,
      onDragEnd: handleDragEnd,
      onTransformEnd: handleTransformEnd,
      onClick: (e) => {
        e.cancelBubble = true;
        setSelectedId(shape.id);
      },
      onTap: (e) => {
        e.cancelBubble = true;
        setSelectedId(shape.id);
      }
    };

    switch (shape.type) {
      case "rect":
        return (
          <Rect
            {...commonProps}
            width={shape.width}
            height={shape.height}
          />
        );
      case "circle":
        return (
          <Circle
            {...commonProps}
            radius={shape.radius}
          />
        );
      case "line":
        return (
          <Line
            {...commonProps}
            points={shape.points}
            closed={shape.closed || false}
            tension={shape.tension || 0}
          />
        );
      case "arrow":
        return (
          <Arrow
            {...commonProps}
            points={shape.points}
            pointerLength={10}
            pointerWidth={10}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#111827" }}>
      {/* Modern Dark Sidebar */}
      <div style={{ 
        width: "280px", 
        padding: "24px", 
        backgroundColor: "#1f2937",
        borderRight: "1px solid #374151",
        overflow: "auto",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)"
      }}>
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ 
            color: "#f9fafb", 
            fontSize: "20px", 
            fontWeight: "700",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Shape Editor
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
            Add and customize shapes
          </p>
        </div>

        {/* Shape Selection */}
        <div style={{ marginBottom: "32px" }}>
          <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
            Shapes
          </h4>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "12px" 
          }}>
            {shapeTypes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setSelectedShape(shape.id)}
                style={{
                  padding: "16px 12px",
                  backgroundColor: selectedShape === shape.id ? "#374151" : "transparent",
                  border: `2px solid ${selectedShape === shape.id ? "#8b5cf6" : "#4b5563"}`,
                  borderRadius: "10px",
                  color: selectedShape === shape.id ? "#f9fafb" : "#9ca3af",
                  cursor: "pointer",
                  fontSize: "24px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseOver={(e) => {
                  if (selectedShape !== shape.id) {
                    e.target.style.borderColor = "#6b7280";
                    e.target.style.color = "#d1d5db";
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedShape !== shape.id) {
                    e.target.style.borderColor = "#4b5563";
                    e.target.style.color = "#9ca3af";
                  }
                }}
              >
                <span>{shape.icon}</span>
                <span style={{ fontSize: "12px", fontWeight: "500" }}>{shape.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Controls */}
        <div style={{ marginBottom: "28px" }}>
          <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
            Colors & Style
          </h4>
          
          {/* Fill Color */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block" }}>
              Fill Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "8px",
                  border: "2px solid #4b5563",
                  cursor: "pointer"
                }}
              />
              <div style={{ 
                padding: "8px 12px", 
                backgroundColor: "#374151",
                border: "1px solid #4b5563",
                borderRadius: "6px",
                color: "#d1d5db",
                fontSize: "12px",
                fontFamily: "monospace"
              }}>
                {fillColor}
              </div>
            </div>
          </div>

          {/* Stroke Color */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block" }}>
              Stroke Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "8px",
                  border: "2px solid #4b5563",
                  cursor: "pointer"
                }}
              />
              <div style={{ 
                padding: "8px 12px", 
                backgroundColor: "#374151",
                border: "1px solid #4b5563",
                borderRadius: "6px",
                color: "#d1d5db",
                fontSize: "12px",
                fontFamily: "monospace"
              }}>
                {strokeColor}
              </div>
            </div>
          </div>

          {/* Stroke Width */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500" }}>Stroke Width</label>
              <span style={{ color: "#8b5cf6", fontSize: "14px", fontWeight: "600" }}>{strokeWidth}px</span>
            </div>
            <input
              type="range"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              min="1"
              max="10"
              style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: "#374151" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>1px</span>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>10px</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <button
              onClick={() => {
                if (selectedId) {
                  setShapes(prev => prev.filter(shape => shape.id !== selectedId));
                  setSelectedId(null);
                }
              }}
              disabled={!selectedId}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: selectedId ? "#ef4444" : "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: selectedId ? "pointer" : "not-allowed",
                fontSize: "14px",
                fontWeight: "500",
                opacity: selectedId ? 1 : 0.5
              }}
            >
              Delete Shape
            </button>
            <button
              onClick={() => {
                setShapes([]);
                setSelectedId(null);
              }}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Stats & Instructions */}
        <div style={{ 
          padding: "16px", 
          backgroundColor: "rgba(55, 65, 81, 0.5)", 
          borderRadius: "10px",
          border: "1px solid #374151"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ color: "#d1d5db", fontSize: "14px" }}>Shapes</span>
            <span style={{ 
              color: "#8b5cf6", 
              fontSize: "16px", 
              fontWeight: "700",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              padding: "4px 12px",
              borderRadius: "20px"
            }}>
              {shapes.length}
            </span>
          </div>
          
          <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ color: selectedId ? "#10b981" : "#6b7280" }}>●</span>
              <span>Shape Selected: {selectedId ? "Yes" : "No"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span style={{ color: "#8b5cf6" }}>●</span>
              <span>Active: {shapeTypes.find(s => s.id === selectedShape)?.name}</span>
            </div>
            <div style={{ padding: "8px", backgroundColor: "rgba(139, 92, 246, 0.1)", borderRadius: "6px", fontSize: "11px" }}>
              💡 Double-click on canvas to add selected shape
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={{ 
        flex: 1, 
        position: "relative", 
        backgroundColor: "#111827" 
      }}>
        <Stage
          width={window.innerWidth - 280}
          height={window.innerHeight}
          ref={stageRef}
          onClick={handleStageClick}        // Single click for selection only
          onDblClick={handleStageDblClick}  // Double click to add shapes
          onDblTap={handleStageDblClick}    // Double tap for mobile
        >
          <Layer>
            {shapes.map(renderShape)}
            
            {/* Transformer for selected shape */}
            {selectedId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>

        {/* Modern Status Bar */}
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
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)"
        }}>
          {selectedId ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span>
              <span>Shape selected - Drag to move, use handles to resize/rotate, or press Delete to remove</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#8b5cf6", fontSize: "16px" }}>💡</span>
              <span>Select a shape from the sidebar and <strong>double-click</strong> on canvas to add it</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShapeMode;