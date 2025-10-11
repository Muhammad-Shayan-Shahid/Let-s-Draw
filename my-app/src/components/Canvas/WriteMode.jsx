import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Text, Transformer } from "react-konva";

const WriteMode = () => {
  const [texts, setTexts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newText, setNewText] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#ffffff");
  const [isAddingText, setIsAddingText] = useState(false);
  const textareaRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const stageContainerRef = useRef(null);

  // Handle single click on stage
  const handleStageClick = (e) => {
    // If clicked on existing text, select it
    if (e.target.getClassName() === "Text") {
      setSelectedId(e.target.attrs.id);
      return;
    }

    // If clicked on empty space and editing, finish editing (save)
    if (editingId) {
      finishEditing();
    }
  };

  // Handle Add Text button click - ONLY WAY to create textbox
  const handleAddTextClick = () => {
    setIsAddingText(true);
    
    // Create a new text element at a default position (center of canvas)
    const stage = stageRef.current;
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    
    const id = "text_" + Date.now().toString();
    const newTextObj = {
      id,
      x: stageWidth / 2 - 100, // Center horizontally
      y: stageHeight / 2 - 15, // Center vertically
      text: "", // Start with empty text
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: textColor,
      width: 200,
      height: 30,
      rotation: 0,
    };

    setTexts([...texts, newTextObj]);
    setSelectedId(id);
    setEditingId(id);
    setNewText("");
    
    // Focus textarea after a small delay
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 10);
  };

  // Handle double click on text → start editing
  const handleTextDblClick = (e) => {
    const id = e.target.attrs.id;
    const textObj = texts.find((t) => t.id === id);
    
    if (textObj) {
      setEditingId(id);
      setNewText(textObj.text);
      setSelectedId(id);
      setIsAddingText(false);
      
      // Small delay to ensure state is updated before focusing
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 10);
    }
  };

  // Finish editing and save text
  const finishEditing = () => {
    if (editingId) {
      setTexts((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, text: newText || "Double click to edit" } : t
        )
      );
    }
    setEditingId(null);
    setNewText("");
    setIsAddingText(false);
  };

  // Handle text drag end
  const handleDragEnd = (e) => {
    const id = e.target.attrs.id;
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, x: e.target.x(), y: e.target.y() } : t
      )
    );
  };

  // Handle text transformation
  const handleTransformEnd = (e) => {
    const node = e.target;
    const id = node.attrs.id;
    
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale and update width/height
    node.scaleX(1);
    node.scaleY(1);

    setTexts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              x: node.x(),
              y: node.y(),
              width: Math.max(30, t.width * scaleX),
              height: Math.max(20, t.height * scaleY),
              rotation: node.rotation(),
            }
          : t
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
        if (editingId) {
          finishEditing();
        }
        setSelectedId(null);
        setIsAddingText(false);
      }
      
      // Delete selected text
      if ((e.key === "Delete" || e.key === "Backspace") && !editingId) {
        if (selectedId) {
          setTexts((prev) => prev.filter((t) => t.id !== selectedId));
          setSelectedId(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, editingId]);

  // Handle outside click to finish editing
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If clicking outside textarea while editing, finish editing
      if (editingId && textareaRef.current && !textareaRef.current.contains(e.target)) {
        finishEditing();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingId]);

  // Update text properties when controls change
  useEffect(() => {
    if (selectedId && !editingId) {
      setTexts((prev) =>
        prev.map((t) =>
          t.id === selectedId
            ? { ...t, fontSize, fontFamily, fill: textColor }
            : t
        )
      );
    }
  }, [fontSize, fontFamily, textColor, selectedId, editingId]);

  // Function to calculate textarea position
  const getTextareaPosition = () => {
    if (!editingId) return { display: 'none' };
    
    const textObj = texts.find((t) => t.id === editingId);
    if (!textObj) return { display: 'none' };

    // Get stage container position
    const stageContainer = stageContainerRef.current;
    const stageRect = stageContainer.getBoundingClientRect();
    
    // Calculate absolute position
    const absoluteX = stageRect.left + textObj.x;
    const absoluteY = stageRect.top + textObj.y;

    return {
      position: "fixed",
      top: absoluteY + "px",
      left: absoluteX + "px",
      width: textObj.width + "px",
      minHeight: textObj.height + "px",
      fontSize: textObj.fontSize + "px",
      fontFamily: textObj.fontFamily,
      fontWeight: "normal",
      color: textObj.fill,
      border: "2px dashed #10b981",
      background: "#1f2937",
      outline: "none",
      resize: "none",
      overflow: "auto",
      padding: "8px",
      margin: 0,
      transform: `rotate(${textObj.rotation}deg)`,
      transformOrigin: "top left",
      zIndex: 1000,
      boxSizing: "border-box",
      lineHeight: "1.4",
      display: "block",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      borderRadius: "6px"
    };
  };

  // Handle textarea input changes
  const handleTextareaChange = (e) => {
    setNewText(e.target.value);
    
    // Auto-resize textarea based on content
    const textarea = e.target;
    setTimeout(() => {
      textarea.style.height = 'auto';
      const newHeight = Math.max(40, textarea.scrollHeight);
      textarea.style.height = newHeight + 'px';
      
      // Update text object height
      if (editingId) {
        setTexts(prev => prev.map(t => 
          t.id === editingId 
            ? { ...t, height: newHeight }
            : t
        ));
      }
    }, 0);
  };

  // Handle textarea key down
  const handleTextareaKeyDown = (e) => {
    // Allow Enter for new lines
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      finishEditing();
    }
    
    // Escape to cancel
    if (e.key === "Escape") {
      e.preventDefault();
      setEditingId(null);
      setNewText("");
      setIsAddingText(false);
    }
  };

  // Handle textarea blur (when it loses focus)
  const handleTextareaBlur = () => {
    // Small timeout to allow for click events to process
    setTimeout(() => {
      finishEditing();
    }, 100);
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
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Text Editor
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
            Customize your text elements
          </p>
        </div>
        
        {/* Add Text Button */}
        <div style={{ marginBottom: "32px" }}>
          <button
            onClick={handleAddTextClick}
            style={{
              width: "100%",
              padding: "14px 20px",
              backgroundColor: "#10b981",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "12px",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.3)";
            }}
          >
            <span style={{ fontSize: "18px" }}>✎</span>
            Add Text Element
          </button>
          {isAddingText && (
            <div style={{
              padding: "12px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#10b981",
              textAlign: "center"
            }}>
              💡 Type in the text box, then click outside to save
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div style={{ marginBottom: "8px" }}>
          <h4 style={{ color: "#f9fafb", fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>
            Text Properties
          </h4>
          
          {/* Font Size */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500" }}>Font Size</label>
              <span style={{ color: "#10b981", fontSize: "14px", fontWeight: "600" }}>{fontSize}px</span>
            </div>
            <input
              type="range"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              min="8"
              max="72"
              style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: "#374151" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>8px</span>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>72px</span>
            </div>
          </div>

          {/* Font Family */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block" }}>Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px 12px", 
                backgroundColor: "#374151",
                border: "1px solid #4b5563",
                borderRadius: "8px",
                color: "#f9fafb",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>
          </div>

          {/* Text Color */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ color: "#d1d5db", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block" }}>Text Color</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
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
                {textColor}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <button
              onClick={() => {
                if (selectedId && !editingId) {
                  setTexts(prev => prev.filter(t => t.id !== selectedId));
                  setSelectedId(null);
                }
              }}
              disabled={!selectedId || editingId}
              style={{
                flex: 1,
                padding: "10px 16px",
                backgroundColor: selectedId && !editingId ? "#ef4444" : "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: selectedId && !editingId ? "pointer" : "not-allowed",
                fontSize: "14px",
                fontWeight: "500",
                opacity: selectedId && !editingId ? 1 : 0.5
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                setTexts([]);
                setSelectedId(null);
                setEditingId(null);
                setIsAddingText(false);
              }}
              style={{
                flex: 1,
                padding: "10px 16px",
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
            <span style={{ color: "#d1d5db", fontSize: "14px" }}>Text Elements</span>
            <span style={{ 
              color: "#10b981", 
              fontSize: "16px", 
              fontWeight: "700",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              padding: "4px 12px",
              borderRadius: "20px"
            }}>
              {texts.length}
            </span>
          </div>
          
          <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ color: selectedId ? "#10b981" : "#6b7280" }}>●</span>
              <span>Text Selected: {selectedId ? "Yes" : "No"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ color: editingId ? "#3b82f6" : "#6b7280" }}>●</span>
              <span>Editing: {editingId ? "Active" : "Inactive"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: isAddingText ? "#f59e0b" : "#6b7280" }}>●</span>
              <span>Add Mode: {isAddingText ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={stageContainerRef}
        style={{ 
          flex: 1, 
          position: "relative", 
          backgroundColor: "#111827" 
        }}
      >
        <Stage
          width={window.innerWidth - 280}
          height={window.innerHeight}
          ref={stageRef}
          onClick={handleStageClick}
        >
          <Layer>
            {texts.map((t) => (
              <Text
                key={t.id}
                id={t.id}
                text={t.text}
                x={t.x}
                y={t.y}
                fontSize={t.fontSize}
                fontFamily={t.fontFamily}
                fill={t.fill}
                width={t.width}
                height={t.height}
                rotation={t.rotation}
                draggable={!editingId}
                onDblClick={handleTextDblClick}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
                onClick={(e) => {
                  e.cancelBubble = true;
                  if (!editingId) {
                    setSelectedId(t.id);
                  }
                }}
                perfectDrawEnabled={false}
                listening={!editingId}
              />
            ))}
            
            {/* Transformer for selected text */}
            {selectedId && !editingId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 30 || newBox.height < 20) {
                    return oldBox;
                  }
                  return newBox;
                }}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'rotater']}
              />
            )}
          </Layer>
        </Stage>

        {/* HTML textarea overlay for editing */}
        <textarea
          ref={textareaRef}
          value={newText}
          onChange={handleTextareaChange}
          onKeyDown={handleTextareaKeyDown}
          onBlur={handleTextareaBlur}
          style={getTextareaPosition()}
          placeholder="Start typing your text... (Click outside or Ctrl+Enter to save)"
        />

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
          {isAddingText ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#f59e0b", fontSize: "16px" }}>📍</span>
              <span>Adding new text - Click on canvas to position, then type in the box above</span>
            </div>
          ) : editingId ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#3b82f6", fontSize: "16px" }}>✎</span>
              <span>Editing text - Type your content (Click outside or Ctrl+Enter to save)</span>
            </div>
          ) : selectedId ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span>
              <span>Text selected - Drag to move, use handles to resize/rotate, or press Delete to remove</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#9ca3af", fontSize: "16px" }}>💡</span>
              <span>Click <strong style={{ color: "#10b981" }}>Add Text Element</strong> to create text, or double-click existing text to edit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteMode;