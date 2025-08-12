"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AppState, HistoryState, TextLayer } from '../types';
import { GOOGLE_FONTS, DEFAULT_CANVAS_SIZE, DEFAULT_TEXT_LAYER, HISTORY_LIMIT, LOCAL_STORAGE_KEY } from '../constants';
import Sidebar from './Sidebar';
import CanvasArea from './CanvasArea';

export default function ImageTextComposer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [appState, setAppState] = useState<AppState>({
    backgroundImage: null,
    imageWidth: DEFAULT_CANVAS_SIZE.width,
    imageHeight: DEFAULT_CANVAS_SIZE.height,
    textLayers: [],
    selectedLayerId: null,
    selectedLayerIds: [],
  });

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load Google Fonts
  useEffect(() => {
    if (!isClient) return;

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=" +
      GOOGLE_FONTS.map((font) => font.replace(/ /g, "+")).join("&family=") +
      ":wght@100;200;300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      const existingLink = document.querySelector(`link[href="${link.href}"]`);
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, [isClient]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      const saveData = {
        ...appState,
        timestamp: Date.now(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [appState, isClient]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!isClient) return;

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setAppState(data);
        saveToHistory(data);
      }
    } catch (error) {
      console.error("Failed to load saved data:", error);
    }
  }, [isClient]);

  // Save state to history
  const saveToHistory = useCallback(
    (state: AppState) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({ state: { ...state }, timestamp: Date.now() });
        return newHistory.slice(-HISTORY_LIMIT);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_LIMIT - 1));
    },
    [historyIndex]
  );

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setAppState(history[historyIndex - 1].state);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setAppState(history[historyIndex + 1].state);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        }
      }

      // Arrow keys for nudging
      if (appState.selectedLayerId && !e.ctrlKey && !e.metaKey) {
        const layer = appState.textLayers.find(
          (l) => l.id === appState.selectedLayerId
        );
        if (layer && !layer.locked) {
          let dx = 0,
            dy = 0;
          const step = e.shiftKey ? 10 : 1;

          switch (e.key) {
            case "ArrowUp":
              dy = -step;
              break;
            case "ArrowDown":
              dy = step;
              break;
            case "ArrowLeft":
              dx = -step;
              break;
            case "ArrowRight":
              dx = step;
              break;
            default:
              return;
          }

          e.preventDefault();
          updateLayer(layer.id, { x: layer.x + dx, y: layer.y + dy });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, appState.selectedLayerId, appState.textLayers, isClient]);

  // Get canvas coordinates from mouse event
  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  // Get layer at position
  const getLayerAtPosition = useCallback(
    (x: number, y: number): TextLayer | null => {
      // Check layers from top to bottom (reverse order)
      for (let i = appState.textLayers.length - 1; i >= 0; i--) {
        const layer = appState.textLayers[i];
        if (!layer.visible || layer.locked) continue;

        // Simple bounding box check (can be enhanced with rotation)
        if (
          x >= layer.x &&
          x <= layer.x + layer.width &&
          y >= layer.y &&
          y <= layer.y + layer.height
        ) {
          return layer;
        }
      }
      return null;
    },
    [appState.textLayers]
  );

  // Check if mouse is on resize handle
  const getResizeHandle = useCallback(
    (x: number, y: number, layer: TextLayer): string => {
      const handleSize = 16;
      const handles = [
        {
          name: "nw",
          x: layer.x - handleSize / 2,
          y: layer.y - handleSize / 2,
        },
        {
          name: "ne",
          x: layer.x + layer.width - handleSize / 2,
          y: layer.y - handleSize / 2,
        },
        {
          name: "sw",
          x: layer.x - handleSize / 2,
          y: layer.y + layer.height - handleSize / 2,
        },
        {
          name: "se",
          x: layer.x + layer.width - handleSize / 2,
          y: layer.y + layer.height - handleSize / 2,
        },
      ];

      for (const handle of handles) {
        if (
          x >= handle.x &&
          x <= handle.x + handleSize &&
          y >= handle.y &&
          y <= handle.y + handleSize
        ) {
          return handle.name;
        }
      }
      return "";
    },
    []
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getCanvasCoordinates(e);
      setMousePos({ x, y });

      const selectedLayer = appState.textLayers.find(
        (l) => l.id === appState.selectedLayerId
      );

      // Check for resize handle first
      if (selectedLayer) {
        const handle = getResizeHandle(x, y, selectedLayer);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragStart({ x, y });
          return;
        }
      }

      // Check for layer selection/dragging
      const clickedLayer = getLayerAtPosition(x, y);
      if (clickedLayer) {
        setAppState((prev) => ({
          ...prev,
          selectedLayerId: clickedLayer.id,
          selectedLayerIds: [clickedLayer.id],
        }));

        if (!clickedLayer.locked) {
          setIsDragging(true);
          setDragStart({
            x: x - clickedLayer.x,
            y: y - clickedLayer.y,
          });
        }
      } else {
        // Clicked on empty area - deselect
        setAppState((prev) => ({
          ...prev,
          selectedLayerId: null,
          selectedLayerIds: [],
        }));
      }
    },
    [
      getCanvasCoordinates,
      getLayerAtPosition,
      getResizeHandle,
      appState.textLayers,
      appState.selectedLayerId,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = getCanvasCoordinates(e);
      setMousePos({ x, y });

      const selectedLayer = appState.textLayers.find(
        (l) => l.id === appState.selectedLayerId
      );

      if (isDragging && selectedLayer && !selectedLayer.locked) {
        // Snap to center guides
        const centerX = appState.imageWidth / 2;
        const centerY = appState.imageHeight / 2;
        const snapThreshold = 10;

        let newX = x - dragStart.x;
        let newY = y - dragStart.y;

        // Snap to horizontal center
        if (
          Math.abs(newX + selectedLayer.width / 2 - centerX) < snapThreshold
        ) {
          newX = centerX - selectedLayer.width / 2;
        }

        // Snap to vertical center
        if (
          Math.abs(newY + selectedLayer.height / 2 - centerY) < snapThreshold
        ) {
          newY = centerY - selectedLayer.height / 2;
        }

        updateLayer(selectedLayer.id, { x: newX, y: newY });
      } else if (isResizing && selectedLayer && !selectedLayer.locked) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;

        let newWidth = selectedLayer.width;
        let newHeight = selectedLayer.height;
        let newX = selectedLayer.x;
        let newY = selectedLayer.y;

        switch (resizeHandle) {
          case "se":
            newWidth = Math.max(20, selectedLayer.width + deltaX);
            newHeight = Math.max(20, selectedLayer.height + deltaY);
            break;
          case "sw":
            newWidth = Math.max(20, selectedLayer.width - deltaX);
            newHeight = Math.max(20, selectedLayer.height + deltaY);
            newX = selectedLayer.x + deltaX;
            break;
          case "ne":
            newWidth = Math.max(20, selectedLayer.width + deltaX);
            newHeight = Math.max(20, selectedLayer.height - deltaY);
            newY = selectedLayer.y + deltaY;
            break;
          case "nw":
            newWidth = Math.max(20, selectedLayer.width - deltaX);
            newHeight = Math.max(20, selectedLayer.height - deltaY);
            newX = selectedLayer.x + deltaX;
            newY = selectedLayer.y + deltaY;
            break;
        }

        updateLayer(selectedLayer.id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
        setDragStart({ x, y });
      } else {
        // Update cursor based on hover state
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (selectedLayer) {
          const handle = getResizeHandle(x, y, selectedLayer);
          if (handle) {
            canvas.style.cursor = getCursorForHandle(handle);
            return;
          }
        }

        const hoverLayer = getLayerAtPosition(x, y);
        canvas.style.cursor = hoverLayer ? "move" : "default";
      }
    },
    [
      getCanvasCoordinates,
      isDragging,
      isResizing,
      dragStart,
      resizeHandle,
      appState,
      getResizeHandle,
      getLayerAtPosition,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging || isResizing) {
      saveToHistory(appState);
    }

    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
  }, [isDragging, isResizing, appState, saveToHistory]);

  const getCursorForHandle = (handle: string): string => {
    switch (handle) {
      case "nw":
      case "se":
        return "nw-resize";
      case "ne":
      case "sw":
        return "ne-resize";
      default:
        return "default";
    }
  };

  // Canvas rendering
  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = appState.imageWidth;
    canvas.height = appState.imageHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderTextLayers = () => {
      appState.textLayers.forEach((layer) => {
        if (!layer.visible) return;

        ctx.save();

        // Apply transformations
        ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);

        // Set text properties
        ctx.font = `${layer.fontWeight} ${layer.fontSize}px "${layer.fontFamily}"`;
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.opacity / 100;
        ctx.textAlign = layer.alignment;

        // Draw text (support multiline)
        const lines = layer.text.split("\n");
        const lineHeight = layer.fontSize * 1.2;
        lines.forEach((line, index) => {
          const y = (index - (lines.length - 1) / 2) * lineHeight;
          ctx.fillText(line, 0, y);
        });

        ctx.restore();

        // Draw selection outline and handles
        if (
          appState.selectedLayerId === layer.id ||
          appState.selectedLayerIds.includes(layer.id)
        ) {
          ctx.strokeStyle = "#007bff";
          ctx.lineWidth = 2;
          ctx.globalAlpha = 1;
          ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);

          // Draw resize handles
          const handleSize = 16;
          const handles = [
            { x: layer.x - handleSize / 2, y: layer.y - handleSize / 2 },
            {
              x: layer.x + layer.width - handleSize / 2,
              y: layer.y - handleSize / 2,
            },
            {
              x: layer.x - handleSize / 2,
              y: layer.y + layer.height - handleSize / 2,
            },
            {
              x: layer.x + layer.width - handleSize / 2,
              y: layer.y + layer.height - handleSize / 2,
            },
          ];

          ctx.fillStyle = "#007bff";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;

          handles.forEach((handle) => {
            ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
            ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
          });
        }
      });
    };

    const renderGuides = () => {
      const selectedLayer = appState.textLayers.find(
        (l) => l.id === appState.selectedLayerId
      );
      if (!selectedLayer || !isDragging) return;

      const centerX = appState.imageWidth / 2;
      const centerY = appState.imageHeight / 2;
      const layerCenterX = selectedLayer.x + selectedLayer.width / 2;
      const layerCenterY = selectedLayer.y + selectedLayer.height / 2;
      const snapThreshold = 10;

      ctx.save();
      ctx.strokeStyle = "#ff4444";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Vertical center guide
      if (Math.abs(layerCenterX - centerX) < snapThreshold) {
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, appState.imageHeight);
        ctx.stroke();
      }

      // Horizontal center guide
      if (Math.abs(layerCenterY - centerY) < snapThreshold) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(appState.imageWidth, centerY);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Draw background
    if (appState.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        renderTextLayers();
        renderGuides();
      };
      img.src = appState.backgroundImage;
    } else {
      // Gray checkerboard background
      const size = 20;
      for (let x = 0; x < canvas.width; x += size) {
        for (let y = 0; y < canvas.height; y += size) {
          ctx.fillStyle = (x / size + y / size) % 2 ? "#f0f0f0" : "#e0e0e0";
          ctx.fillRect(x, y, size, size);
        }
      }
      renderTextLayers();
      renderGuides();
    }
  }, [appState, mousePos, isDragging, isClient]);

  // File upload handler
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.includes("png")) {
        alert("Please upload a PNG file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newState = {
            ...appState,
            backgroundImage: event.target?.result as string,
            imageWidth: img.width,
            imageHeight: img.height,
            textLayers: [],
            selectedLayerId: null,
            selectedLayerIds: [],
          };
          setAppState(newState);
          saveToHistory(newState);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [appState, saveToHistory]
  );

  // Add new text layer
  const addTextLayer = useCallback(() => {
    const estimatedWidth = DEFAULT_TEXT_LAYER.text.length * DEFAULT_TEXT_LAYER.fontSize * 0.6;
    const estimatedHeight = DEFAULT_TEXT_LAYER.fontSize * 1.5;

    const newLayer: TextLayer = {
      ...DEFAULT_TEXT_LAYER,
      id: Date.now().toString(),
      x: appState.imageWidth / 2 - estimatedWidth / 2,
      y: appState.imageHeight / 2 - estimatedHeight / 2,
      width: estimatedWidth,
      height: estimatedHeight,
    };

    const newState = {
      ...appState,
      textLayers: [...appState.textLayers, newLayer],
      selectedLayerId: newLayer.id,
      selectedLayerIds: [newLayer.id],
    };
    setAppState(newState);
    saveToHistory(newState);
  }, [appState, saveToHistory]);

  // Update layer properties
  const updateLayer = useCallback(
    (id: string, updates: Partial<TextLayer>) => {
      const newState = {
        ...appState,
        textLayers: appState.textLayers.map((layer) => {
          if (layer.id === id) {
            const updated = { ...layer, ...updates };

            // Auto-resize layer bounds when text or font properties change
            if (
              updates.text !== undefined ||
              updates.fontSize !== undefined ||
              updates.fontFamily !== undefined ||
              updates.fontWeight !== undefined
            ) {
              const lines = updated.text.split("\n");
              const maxLineLength = Math.max(
                ...lines.map((line) => line.length)
              );
              const estimatedWidth = Math.max(
                50,
                maxLineLength * updated.fontSize * 0.6
              );
              const estimatedHeight = Math.max(
                30,
                lines.length * updated.fontSize * 1.2
              );

              updated.width = estimatedWidth;
              updated.height = estimatedHeight;
            }

            return updated;
          }
          return layer;
        }),
      };
      setAppState(newState);
    },
    [appState]
  );

  // Delete layer
  const deleteLayer = useCallback(
    (id: string) => {
      const newState = {
        ...appState,
        textLayers: appState.textLayers.filter((layer) => layer.id !== id),
        selectedLayerId:
          appState.selectedLayerId === id ? null : appState.selectedLayerId,
        selectedLayerIds: appState.selectedLayerIds.filter(
          (layerId) => layerId !== id
        ),
      };
      setAppState(newState);
      saveToHistory(newState);
    },
    [appState, saveToHistory]
  );

  // Duplicate layer
  const duplicateLayer = useCallback(
    (id: string) => {
      const layer = appState.textLayers.find((l) => l.id === id);
      if (!layer) return;

      const newLayer = {
        ...layer,
        id: Date.now().toString(),
        x: layer.x + 20,
        y: layer.y + 20,
      };

      const newState = {
        ...appState,
        textLayers: [...appState.textLayers, newLayer],
        selectedLayerId: newLayer.id,
        selectedLayerIds: [newLayer.id],
      };
      setAppState(newState);
      saveToHistory(newState);
    },
    [appState, saveToHistory]
  );

  // Reorder layers
  const moveLayer = useCallback(
    (id: string, direction: "up" | "down") => {
      const index = appState.textLayers.findIndex((layer) => layer.id === id);
      if (index === -1) return;

      const newIndex = direction === "up" ? index + 1 : index - 1;
      if (newIndex < 0 || newIndex >= appState.textLayers.length) return;

      const newLayers = [...appState.textLayers];
      [newLayers[index], newLayers[newIndex]] = [
        newLayers[newIndex],
        newLayers[index],
      ];

      const newState = { ...appState, textLayers: newLayers };
      setAppState(newState);
      saveToHistory(newState);
    },
    [appState, saveToHistory]
  );

  // Export as PNG
  const exportImage = useCallback(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create export canvas with original dimensions
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    exportCanvas.width = appState.imageWidth;
    exportCanvas.height = appState.imageHeight;

    // Draw background
    if (appState.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        exportCtx.drawImage(img, 0, 0);

        // Draw text layers
        appState.textLayers.forEach((layer) => {
          if (!layer.visible) return;

          exportCtx.save();
          exportCtx.translate(
            layer.x + layer.width / 2,
            layer.y + layer.height / 2
          );
          exportCtx.rotate((layer.rotation * Math.PI) / 180);
          exportCtx.font = `${layer.fontWeight} ${layer.fontSize}px "${layer.fontFamily}"`;
          exportCtx.fillStyle = layer.color;
          exportCtx.globalAlpha = layer.opacity / 100;
          exportCtx.textAlign = layer.alignment;

          const lines = layer.text.split("\n");
          const lineHeight = layer.fontSize * 1.2;
          lines.forEach((line, index) => {
            const y = (index - (lines.length - 1) / 2) * lineHeight;
            exportCtx.fillText(line, 0, y);
          });

          exportCtx.restore();
        });

        // Download
        exportCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "image-text-composition.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      };
      img.src = appState.backgroundImage;
    }
  }, [appState, isClient]);

  // Reset app
  const resetApp = useCallback(() => {
    if (!isClient) return;

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }

    const newState = {
      backgroundImage: null,
      imageWidth: DEFAULT_CANVAS_SIZE.width,
      imageHeight: DEFAULT_CANVAS_SIZE.height,
      textLayers: [],
      selectedLayerId: null,
      selectedLayerIds: [],
    };
    setAppState(newState);
    setHistory([]);
    setHistoryIndex(-1);
  }, [isClient]);

  const selectedLayer = appState.textLayers.find(
    (layer) => layer.id === appState.selectedLayerId
  );

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Sidebar
        appState={appState}
        setAppState={setAppState}
        fileInputRef={fileInputRef}
        selectedLayer={selectedLayer}
        history={history}
        historyIndex={historyIndex}
        onFileUpload={handleFileUpload}
        onAddTextLayer={addTextLayer}
        onUndo={undo}
        onRedo={redo}
        onExport={exportImage}
        onReset={resetApp}
        onUpdateLayer={updateLayer}
        onDeleteLayer={deleteLayer}
        onDuplicateLayer={duplicateLayer}
        onMoveLayer={moveLayer}
      />

      <CanvasArea
        appState={appState}
        setAppState={setAppState}
        canvasRef={canvasRef}
        selectedLayer={selectedLayer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}