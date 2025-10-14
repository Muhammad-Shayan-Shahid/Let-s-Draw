import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image } from "react-konva";

const DrawMode = () => {
  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [eraserSize, setEraserSize] = useState(20);
  const isDrawing = useRef(false);
  const imageRef = useRef(null);
  const lastPos = useRef(null);
  const stageRef = useRef(null);

  // Large canvas dimensions
  const CANVAS_WIDTH = 3000;
  const CANVAS_HEIGHT = 3000;

  const { canvas, context } = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const context = canvas.getContext("2d");
    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = brushColor;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = brushSize;
    return { canvas, context };
  }, []);

  // Update context when brush properties change
  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === "eraser" ? "#111827" : brushColor;
      context.lineWidth = tool === "eraser" ? eraserSize : brushSize;
      context.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    }
  }, [tool, brushColor, brushSize, eraserSize, context]);

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

  const clearCanvas = () => {
    context.fillStyle = "#111827";
    context.fillRect(0, 0, canvas.width, canvas.height);
    imageRef.current.getLayer().batchDraw();
  };

  const brushColors = [
    "#ffffff", "#ef4444", "#f97316", "#eab308", 
    "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#111827" }}>
      {/* Modern Dark Sidebar - Fixed */}
      <div style={{ 
        width: "280px", 
        backgroundColor: "#1f2937",
        borderRight: "1px solid #374151",
        overflow: "auto",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
        position: "sticky",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 100
      }}>
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ 
              color: "#f9fafb", 
              fontSize: "20px", 
              fontWeight: "700",
              marginBottom: "8px",
              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Draw Mode
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
              Freehand drawing tools
            </p>
          </div>

          {/* Tool Selection */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
              Tools
            </h4>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setTool("brush")}
                style={{
                  flex: 1,
                  padding: "16px 12px",
                  backgroundColor: tool === "brush" ? "#374151" : "transparent",
                  border: `2px solid ${tool === "brush" ? "#ec4899" : "#4b5563"}`,
                  borderRadius: "10px",
                  color: tool === "brush" ? "#f9fafb" : "#9ca3af",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span style={{ fontSize: "24px" }}>🖌️</span>
                <span>Brush</span>
              </button>
              <button
                onClick={() => setTool("eraser")}
                style={{
                  flex: 1,
                  padding: "16px 12px",
                  backgroundColor: tool === "eraser" ? "#374151" : "transparent",
                  border: `2px solid ${tool === "eraser" ? "#ec4899" : "#4b5563"}`,
                  borderRadius: "10px",
                  color: tool === "eraser" ? "#f9fafb" : "#9ca3af",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span style={{ fontSize: "24px" }}>🧹</span>
                <span>Eraser</span>
              </button>
            </div>
          </div>

          {/* Brush Controls */}
          {tool === "brush" && (
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                Brush Settings
              </h4>
              
              {/* Brush Size */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500" }}>Brush Size</label>
                  <span style={{ color: "#ec4899", fontSize: "14px", fontWeight: "600" }}>{brushSize}px</span>
                </div>
                <input
                  type="range"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  min="1"
                  max="50"
                  style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: "#374151" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>1px</span>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>50px</span>
                </div>
              </div>

              {/* Brush Color */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", marginBottom: "12px", display: "block" }}>
                  Brush Color
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {brushColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: color,
                        border: `3px solid ${brushColor === color ? "#ec4899" : "#4b5563"}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    style={{ 
                      width: "40px", 
                      height: "40px", 
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
                    {brushColor}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Eraser Controls */}
          {tool === "eraser" && (
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                Eraser Settings
              </h4>
              
              {/* Eraser Size */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500" }}>Eraser Size</label>
                  <span style={{ color: "#ec4899", fontSize: "14px", fontWeight: "600" }}>{eraserSize}px</span>
                </div>
                <input
                  type="range"
                  value={eraserSize}
                  onChange={(e) => setEraserSize(parseInt(e.target.value))}
                  min="5"
                  max="100"
                  style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: "#374151" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>5px</span>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>100px</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ marginBottom: "28px" }}>
            <button
              onClick={clearCanvas}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "12px"
              }}
            >
              🗑️ Clear Canvas
            </button>
          </div>

          {/* Stats & Instructions */}
          <div style={{ 
            padding: "16px", 
            backgroundColor: "rgba(55, 65, 81, 0.5)", 
            borderRadius: "10px",
            border: "1px solid #374151"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ color: "#d1d5db", fontSize: "14px" }}>Active Tool</span>
              <span style={{ 
                color: "#ec4899", 
                fontSize: "14px", 
                fontWeight: "700",
                backgroundColor: "rgba(236, 72, 153, 0.1)",
                padding: "4px 12px",
                borderRadius: "20px"
              }}>
                {tool === "brush" ? "Brush" : "Eraser"}
              </span>
            </div>
            
            <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ color: tool === "brush" ? "#ec4899" : "#6b7280" }}>●</span>
                <span>Brush: {brushSize}px • {brushColor}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ color: tool === "eraser" ? "#ec4899" : "#6b7280" }}>●</span>
                <span>Eraser: {eraserSize}px</span>
              </div>
              <div style={{ padding: "8px", backgroundColor: "rgba(236, 72, 153, 0.1)", borderRadius: "6px", fontSize: "11px" }}>
                💡 Click and drag on canvas to draw
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area - Scrollable */}
      <div style={{ 
        flex: 1, 
        position: "relative", 
        backgroundColor: "#111827",
        overflow: "hidden"
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          position: "relative"
        }}>
          <Stage
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            ref={stageRef}
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
        </div>

        {/* Modern Status Bar - Fixed Position */}
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
          backdropFilter: "blur(10px)",
          zIndex: 50
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ 
              color: tool === "brush" ? "#ec4899" : "#6b7280",
              fontSize: "16px" 
            }}>
              {tool === "brush" ? "🖌️" : "🧹"}
            </span>
            <span>
              {tool === "brush" 
                ? `Drawing with ${brushSize}px brush • ${brushColor}` 
                : `Erasing with ${eraserSize}px eraser`
              } • Click and drag to {tool === "brush" ? "draw" : "erase"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawMode;

