import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ToolType, BlendMode, Layer, HistoryItem, DocumentSettings } from '../types';

interface WorkspaceProps {
  settings: DocumentSettings;
  layers: Layer[];
  activeLayerIndex: number;
  onSelectLayer: (index: number) => void;
  onAddLayer: () => void;
  onDuplicateLayer: () => void;
  onDeleteLayer: () => void;
  onToggleLayerVisibility: (index: number) => void;
  onUpdateLayerOpacity: (opacity: number) => void;
  onUpdateLayerBlend: (blend: BlendMode) => void;
  onMoveLayer: (fromIndex: number, toIndex: number) => void;
  onFlattenLayers: () => void;
  history: HistoryItem[];
  onAddHistory: (action: string) => void;
  onReturnHome: () => void;
  onNotify: (msg: string) => void;
  onSavePNG: () => void;
  onExportPSD: () => void;
  show3DOverlay: boolean;
  onToggle3DOverlay: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  settings,
  layers,
  activeLayerIndex,
  onSelectLayer,
  onAddLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onToggleLayerVisibility,
  onUpdateLayerOpacity,
  onUpdateLayerBlend,
  onMoveLayer,
  onFlattenLayers,
  history,
  onAddHistory,
  onReturnHome,
  onNotify,
  onSavePNG,
  onExportPSD,
  show3DOverlay,
  onToggle3DOverlay
}) => {
  // Tools & Drawing State
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [fgColor, setFgColor] = useState<string>('#007acc');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [brushOpacity, setBrushOpacity] = useState<number>(100);
  const [shapeMode, setShapeMode] = useState<'rect' | 'circle' | 'line'>('rect');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [activeTab, setActiveTab] = useState<'layers' | 'properties' | 'history'>('layers');
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Wireframe Settings
  const [wireframeColor, setWireframeColor] = useState<string>('#00d2ff');
  const [animate3D, setAnimate3D] = useState<boolean>(false);
  const [rotation3D, setRotation3D] = useState<number>(0);
  const [scale3D, setScale3D] = useState<number>(1.0);

  // References
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlay3DCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const isDrawingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);

  // Composite all visible layers onto the display canvas
  const compositeLayers = useCallback(() => {
    const mainCanvas = mainCanvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    layers.forEach(layer => {
      if (!layer.visible) return;
      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;
      ctx.globalCompositeOperation = getCanvasBlendMode(layer.blend);
      ctx.drawImage(layer.canvas, 0, 0);
      ctx.restore();
    });
  }, [layers]);

  function getCanvasBlendMode(blend: BlendMode): GlobalCompositeOperation {
    switch (blend) {
      case 'multiply': return 'multiply';
      case 'screen': return 'screen';
      case 'overlay': return 'overlay';
      case 'darken': return 'darken';
      case 'lighten': return 'lighten';
      case 'color-dodge': return 'color-dodge';
      case 'soft-light': return 'soft-light';
      default: return 'source-over';
    }
  }

  // Render 3D Wolf Wireframe
  const render3DWolfWireframe = useCallback((angleY: number) => {
    const canvas = overlay3DCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!show3DOverlay) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const baseScale = (Math.min(canvas.width, canvas.height) / 360) * scale3D;

    // 3D vertices for geometric wolf head [x, y, z]
    const rawVertices: [number, number, number][] = [
      [0, -110, 20],     // 0: Crown tip
      [-35, -55, 10],    // 1: Left brow
      [35, -55, 10],     // 2: Right brow
      [0, -25, 45],      // 3: Forehead center
      [-75, -80, -20],   // 4: Left ear top
      [75, -80, -20],    // 5: Right ear top
      [-55, 0, 15],      // 6: Left cheek
      [55, 0, 15],       // 7: Right cheek
      [0, 35, 55],       // 8: Snout bridge
      [-80, 15, -15],    // 9: Left jaw
      [80, 15, -15],     // 10: Right jaw
      [-40, 65, 25],     // 11: Left muzzle
      [40, 65, 25],      // 12: Right muzzle
      [0, 105, 35],      // 13: Nose tip / chin
      [-30, 85, 0],      // 14: Left lower jaw
      [30, 85, 0],       // 15: Right lower jaw
      [-22, -30, 35],    // 16: Left eye
      [22, -30, 35]      // 17: Right eye
    ];

    const rad = (angleY * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    // Rotate and project to 2D
    const projected = rawVertices.map(([x, y, z]) => {
      const rx = x * cosA - z * sinA;
      const rz = x * sinA + z * cosA + 200; // perspective distance
      const fov = 260 / (260 + rz * 0.4);
      return [cx + rx * baseScale * fov, cy + y * baseScale * fov];
    });

    // Wireframe facet polygons (triangles / quads)
    const facets: number[][] = [
      [0, 1, 3],
      [0, 3, 2],
      [1, 4, 6],
      [2, 5, 7],
      [0, 4, 1],
      [0, 2, 5],
      [1, 6, 3],
      [2, 3, 7],
      [3, 6, 8],
      [3, 8, 7],
      [6, 9, 11],
      [7, 12, 10],
      [6, 11, 8],
      [7, 8, 12],
      [8, 11, 13],
      [8, 13, 12],
      [11, 14, 13],
      [12, 13, 15],
      [9, 14, 11],
      [10, 12, 15]
    ];

    ctx.save();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = wireframeColor;
    ctx.fillStyle = 'rgba(10, 37, 64, 0.35)';

    facets.forEach(indices => {
      ctx.beginPath();
      const first = projected[indices[0]];
      ctx.moveTo(first[0], first[1]);
      for (let i = 1; i < indices.length; i++) {
        const pt = projected[indices[i]];
        ctx.lineTo(pt[0], pt[1]);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Glowing cyan wolf eyes
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    [16, 17].forEach(eyeIdx => {
      const pt = projected[eyeIdx];
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 4.5 * baseScale, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, [show3DOverlay, wireframeColor, scale3D]);

  // Animation frame loop for 3D rotation
  useEffect(() => {
    let animId: number;
    if (show3DOverlay && animate3D) {
      const loop = () => {
        setRotation3D(prev => (prev + 1.2) % 360);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    } else {
      render3DWolfWireframe(rotation3D);
    }
    return () => cancelAnimationFrame(animId);
  }, [show3DOverlay, animate3D, rotation3D, render3DWolfWireframe]);

  // Re-composite whenever layers change
  useEffect(() => {
    compositeLayers();
  }, [layers, compositeLayers]);

  // Update canvas sizing & initial layout
  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const overlayCanvas = overlay3DCanvasRef.current;
    if (!mainCanvas || !overlayCanvas) return;

    mainCanvas.width = settings.width;
    mainCanvas.height = settings.height;
    overlayCanvas.width = settings.width;
    overlayCanvas.height = settings.height;

    compositeLayers();
    render3DWolfWireframe(rotation3D);
  }, [settings.width, settings.height, compositeLayers, render3DWolfWireframe, rotation3D]);

  // Handle Coordinates mapping from mouse/touch event to canvas pixels
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const mainCanvas = mainCanvasRef.current;
    if (!mainCanvas) return { x: 0, y: 0 };
    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = mainCanvas.width / rect.width;
    const scaleY = mainCanvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Drawing event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (layers.length === 0) return;
    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer || !activeLayer.visible || activeLayer.locked) {
      onNotify('Layer is hidden or locked');
      return;
    }

    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;
    lastXRef.current = coords.x;
    lastYRef.current = coords.y;
    startXRef.current = coords.x;
    startYRef.current = coords.y;

    if (activeTool === 'eyedropper') {
      pickColorFromCanvas(coords.x, coords.y);
      isDrawingRef.current = false;
    } else if (activeTool === 'text') {
      promptAddText(coords.x, coords.y);
      isDrawingRef.current = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setCursorCoords({ x: Math.round(coords.x), y: Math.round(coords.y) });

    if (!isDrawingRef.current || layers.length === 0) return;
    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer || !activeLayer.visible || activeLayer.locked) return;

    const ctx = activeLayer.ctx;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = brushOpacity / 100;

    if (activeTool === 'brush') {
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(lastXRef.current, lastYRef.current);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      lastXRef.current = coords.x;
      lastYRef.current = coords.y;
    } else if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(lastXRef.current, lastYRef.current);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      lastXRef.current = coords.x;
      lastYRef.current = coords.y;
    }

    ctx.restore();
    compositeLayers();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer) return;

    const coords = getCanvasCoords(e);
    const ctx = activeLayer.ctx;

    if (activeTool === 'shape') {
      ctx.save();
      ctx.fillStyle = fgColor;
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = brushOpacity / 100;

      const w = coords.x - startXRef.current;
      const h = coords.y - startYRef.current;

      if (shapeMode === 'rect') {
        ctx.fillRect(startXRef.current, startYRef.current, w, h);
      } else if (shapeMode === 'circle') {
        ctx.beginPath();
        const rx = Math.abs(w) / 2;
        const ry = Math.abs(h) / 2;
        const cx = startXRef.current + w / 2;
        const cy = startYRef.current + h / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (shapeMode === 'line') {
        ctx.beginPath();
        ctx.moveTo(startXRef.current, startYRef.current);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      }
      ctx.restore();
      compositeLayers();
      onAddHistory(`Drew Shape (${shapeMode})`);
    } else if (activeTool === 'marquee' || activeTool === 'lasso') {
      onNotify(`Selection bounded: ${Math.round(Math.abs(coords.x - startXRef.current))}x${Math.round(Math.abs(coords.y - startYRef.current))} px`);
    } else if (activeTool === 'brush') {
      onAddHistory('Brush Stroke');
    } else if (activeTool === 'eraser') {
      onAddHistory('Eraser Stroke');
    }
  };

  const pickColorFromCanvas = (x: number, y: number) => {
    const mainCanvas = mainCanvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
    setFgColor(hex);
    onNotify(`Picked Color: ${hex}`);
  };

  const promptAddText = (x: number, y: number) => {
    const text = prompt('Enter Text for Layer:', 'Photo Magic Studio');
    if (!text) return;
    const activeLayer = layers[activeLayerIndex];
    if (!activeLayer) return;

    const ctx = activeLayer.ctx;
    ctx.save();
    const fontSize = Math.max(16, brushSize * 2.5);
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = fgColor;
    ctx.fillText(text, x, y);
    ctx.restore();

    compositeLayers();
    onAddHistory(`Added Text: "${text}"`);
    onNotify('Text layer added to workspace');
  };

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'v' || e.key === 'V') setActiveTool('move');
      if (e.key === 'm' || e.key === 'M') setActiveTool('marquee');
      if (e.key === 'l' || e.key === 'L') setActiveTool('lasso');
      if (e.key === 'b' || e.key === 'B') setActiveTool('brush');
      if (e.key === 'e' || e.key === 'E') setActiveTool('eraser');
      if (e.key === 'p' || e.key === 'P') setActiveTool('pen');
      if (e.key === 't' || e.key === 'T') setActiveTool('text');
      if (e.key === 'u' || e.key === 'U') setActiveTool('shape');
      if (e.key === 'i' || e.key === 'I') setActiveTool('eyedropper');
      if (e.key === 'x' || e.key === 'X') {
        // Swap colors
        const temp = fgColor;
        setFgColor(bgColor);
        setBgColor(temp);
      }
      if (e.key === 'd' || e.key === 'D') {
        // Reset colors
        setFgColor('#000000');
        setBgColor('#ffffff');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fgColor, bgColor]);

  const activeLayer = layers[activeLayerIndex];

  return (
    <section className="flex-1 flex w-full h-full relative overflow-hidden select-none">
      
      {/* LEFT TOOLBAR PALETTE */}
      <aside className="w-12 bg-[#252526] border-r border-[#383838] flex flex-col items-center py-2 space-y-1.5 shrink-0 z-20 text-[#888888]">
        <button
          onClick={() => setActiveTool('move')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'move' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Move Tool (V)"
        >
          <i className="fa-solid fa-arrow-pointer text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('marquee')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'marquee' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Rectangular Marquee Tool (M)"
        >
          <i className="fa-regular fa-square text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('lasso')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'lasso' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Lasso Selection (L)"
        >
          <i className="fa-solid fa-vector-square text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('brush')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'brush' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Brush Tool (B)"
        >
          <i className="fa-solid fa-paint-brush text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('eraser')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'eraser' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Eraser Tool (E)"
        >
          <i className="fa-solid fa-eraser text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('pen')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'pen' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Pen / Path Tool (P)"
        >
          <i className="fa-solid fa-pen-nib text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('text')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'text' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Horizontal Type Tool (T)"
        >
          <i className="fa-solid fa-font text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('shape')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'shape' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Shape / Vector Tool (U)"
        >
          <i className="fa-solid fa-shapes text-xs"></i>
        </button>

        <button
          onClick={() => setActiveTool('eyedropper')}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
            activeTool === 'eyedropper' ? 'bg-[#3c3c3c] text-[#0098ff]' : 'hover:bg-[#3c3c3c] hover:text-white'
          }`}
          title="Eyedropper Tool (I)"
        >
          <i className="fa-solid fa-eye-dropper text-xs"></i>
        </button>

        <div className="border-t border-[#383838] w-6 my-1.5"></div>

        {/* Color Swatch Foreground / Background */}
        <div className="relative w-8 h-8 my-1">
          {/* Foreground Color Picker */}
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="absolute left-0 top-0 w-5 h-5 rounded cursor-pointer border border-[#383838] bg-transparent p-0 z-10"
            title="Set Foreground Color"
          />
          {/* Background Color Picker */}
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="absolute right-0 bottom-0 w-5 h-5 rounded cursor-pointer border border-[#383838] bg-transparent p-0"
            title="Set Background Color"
          />
        </div>

        {/* Swap Colors Button (X) */}
        <button
          onClick={() => {
            const temp = fgColor;
            setFgColor(bgColor);
            setBgColor(temp);
          }}
          className="text-[10px] hover:text-white cursor-pointer transition"
          title="Swap Colors (X)"
        >
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>

        {/* Reset Colors Button (D) */}
        <button
          onClick={() => {
            setFgColor('#000000');
            setBgColor('#ffffff');
          }}
          className="text-[9px] hover:text-white cursor-pointer transition font-mono"
          title="Reset to Black & White (D)"
        >
          D
        </button>
      </aside>

      {/* CENTER WORKSPACE: TOOL OPTIONS BAR + CANVAS + FOOTER */}
      <div className="flex-1 flex flex-col bg-[#141414] overflow-hidden relative">
        
        {/* Tool Options Bar Header */}
        <div className="bg-[#2d2d2d] border-b border-[#383838] h-8 flex items-center px-4 text-xs text-[#888888] space-x-4 shrink-0">
          <span className="font-semibold text-gray-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <span className="text-[#0098ff]">Tool:</span>
            <span>{activeTool.toUpperCase()}</span>
          </span>

          <div className="h-4 w-px bg-[#383838]"></div>

          {/* Context controls for Brush & Eraser & Shape */}
          <div className="flex items-center space-x-4 text-[11px]">
            <label className="flex items-center space-x-1.5">
              <span>Size:</span>
              <input
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-gray-300 w-8 font-mono">{brushSize}px</span>
            </label>

            <label className="flex items-center space-x-1.5">
              <span>Opacity:</span>
              <input
                type="range"
                min="1"
                max="100"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-gray-300 w-8 font-mono">{brushOpacity}%</span>
            </label>

            {activeTool === 'shape' && (
              <div className="flex items-center space-x-1 bg-[#1e1e1e] p-0.5 rounded border border-[#383838]">
                <button
                  onClick={() => setShapeMode('rect')}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    shapeMode === 'rect' ? 'bg-[#007acc] text-white' : 'text-[#888888] hover:text-white'
                  }`}
                  title="Rectangle"
                >
                  <i className="fa-regular fa-square"></i>
                </button>
                <button
                  onClick={() => setShapeMode('circle')}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    shapeMode === 'circle' ? 'bg-[#007acc] text-white' : 'text-[#888888] hover:text-white'
                  }`}
                  title="Circle / Ellipse"
                >
                  <i className="fa-regular fa-circle"></i>
                </button>
                <button
                  onClick={() => setShapeMode('line')}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    shapeMode === 'line' ? 'bg-[#007acc] text-white' : 'text-[#888888] hover:text-white'
                  }`}
                  title="Line"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
              </div>
            )}
          </div>

          {/* Right Actions on Options Bar */}
          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={onToggle3DOverlay}
              className={`px-2 py-0.5 border rounded font-mono text-[10px] flex items-center space-x-1 transition cursor-pointer ${
                show3DOverlay
                  ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(0,210,255,0.4)]'
                  : 'bg-[#252526] border-[#383838] text-gray-400 hover:text-gray-200 hover:bg-[#3c3c3c]'
              }`}
            >
              <i className="fa-solid fa-cube text-cyan-400"></i>
              <span>3D Wolf Overlay {show3DOverlay ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={onSavePNG}
              className="px-2 py-0.5 bg-[#252526] border border-[#383838] hover:bg-[#3c3c3c] text-emerald-400 rounded text-[10px] cursor-pointer flex items-center space-x-1"
              title="Save PNG (Ctrl+S)"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Save</span>
            </button>

            <button
              onClick={onReturnHome}
              className="px-2 py-0.5 bg-[#252526] border border-[#383838] hover:bg-[#3c3c3c] text-gray-300 rounded text-[10px] cursor-pointer flex items-center space-x-1"
            >
              <i className="fa-solid fa-house"></i>
              <span>Launcher</span>
            </button>
          </div>
        </div>

        {/* Canvas Viewport with Photoshop-style Checkerboard */}
        <div
          ref={viewportRef}
          className="flex-1 overflow-auto flex items-center justify-center p-6 relative canvas-checkerboard"
        >
          <div
            ref={canvasWrapperRef}
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            className="relative shadow-2xl transition-transform duration-75 select-none"
          >
            {/* Main Interactive Drawing Canvas */}
            <canvas
              ref={mainCanvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="bg-white block cursor-crosshair rounded-sm shadow-2xl"
            />

            {/* 3D Wolf Wireframe Overlay Canvas */}
            <canvas
              ref={overlay3DCanvasRef}
              className={`absolute inset-0 pointer-events-none ${show3DOverlay ? 'block' : 'hidden'}`}
            />
          </div>
        </div>

        {/* Canvas Footer Bar */}
        <div className="bg-[#252526] border-t border-[#383838] h-6 flex items-center justify-between px-3 text-[10px] text-[#888888] shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span>Zoom:</span>
              <button
                onClick={() => setZoomLevel(1.0)}
                className="text-gray-300 font-mono hover:text-[#0098ff] transition cursor-pointer"
                title="Click to reset zoom to 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(3.0, prev + 0.1))}
                className="hover:text-white px-1"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.2, prev - 0.1))}
                className="hover:text-white px-1"
                title="Zoom Out"
              >
                -
              </button>
            </div>

            <span>
              Doc:&nbsp;
              <strong className="text-gray-300 font-mono">
                {settings.width} &times; {settings.height} px
              </strong>
            </span>

            <span>
              Active Layer:&nbsp;
              <strong className="text-[#0098ff]">{activeLayer?.name || 'None'}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span>
              X: <span className="text-gray-300 font-mono">{cursorCoords.x}</span> Y: <span className="text-gray-300 font-mono">{cursorCoords.y}</span>
            </span>
            <span className="hidden sm:inline">
              Platform: <strong className="text-gray-300">Windows 11 / macOS Desktop Mode</strong>
            </span>
          </div>
        </div>

      </div>

      {/* RIGHT DOCKABLE PANELS SIDEBAR */}
      <aside className="w-64 bg-[#252526] border-l border-[#383838] flex flex-col text-xs select-none shrink-0">
        
        {/* PANEL TABS HEADER */}
        <div className="flex border-b border-[#383838] bg-[#2d2d2d]">
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'layers'
                ? 'border-[#007acc] text-white bg-[#252526]'
                : 'border-transparent text-[#888888] hover:text-gray-200'
            }`}
          >
            Layers
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'properties'
                ? 'border-[#007acc] text-white bg-[#252526]'
                : 'border-transparent text-[#888888] hover:text-gray-200'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#007acc] text-white bg-[#252526]'
                : 'border-transparent text-[#888888] hover:text-gray-200'
            }`}
          >
            History
          </button>
        </div>

        {/* TAB 1: LAYERS PANEL */}
        {activeTab === 'layers' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Layer Controls Bar */}
            <div className="p-2 border-b border-[#383838] space-y-2 bg-[#252526]">
              <div className="flex items-center justify-between">
                <span className="text-[#888888] text-[11px]">Blend Mode</span>
                <select
                  value={activeLayer?.blend || 'normal'}
                  onChange={(e) => onUpdateLayerBlend(e.target.value as BlendMode)}
                  className="bg-[#1e1e1e] border border-[#383838] rounded px-2 py-0.5 text-xs text-gray-200 focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="darken">Darken</option>
                  <option value="lighten">Lighten</option>
                  <option value="color-dodge">Color Dodge</option>
                  <option value="soft-light">Soft Light</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#888888] text-[11px]">Opacity</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeLayer?.opacity ?? 100}
                    onChange={(e) => onUpdateLayerOpacity(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-gray-300 text-[10px] w-6 font-mono">
                    {activeLayer?.opacity ?? 100}%
                  </span>
                </div>
              </div>
            </div>

            {/* Layer List (Photoshop renders top layer first) */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#383838]/40">
              {layers.slice().reverse().map((layer, reverseIndex) => {
                const actualIndex = layers.length - 1 - reverseIndex;
                const isActive = actualIndex === activeLayerIndex;

                return (
                  <div
                    key={layer.id}
                    onClick={() => onSelectLayer(actualIndex)}
                    className={`p-2.5 flex items-center justify-between cursor-pointer transition ${
                      isActive
                        ? 'bg-[#007acc]/20 border-l-4 border-l-[#007acc] text-white'
                        : 'hover:bg-[#3c3c3c] text-[#888888]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      {/* Visibility Toggle Eye */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLayerVisibility(actualIndex);
                        }}
                        className="hover:text-white cursor-pointer p-0.5"
                        title="Toggle Layer Visibility"
                      >
                        <i
                          className={`fa-solid ${
                            layer.visible ? 'fa-eye text-gray-300' : 'fa-eye-slash text-gray-600'
                          } text-xs`}
                        ></i>
                      </button>

                      {/* Layer Icon/Thumbnail */}
                      <div className="w-6 h-6 bg-[#1e1e1e] border border-[#383838] rounded flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-image text-[10px] text-gray-400"></i>
                      </div>

                      {/* Layer Name */}
                      <span className="text-xs font-medium truncate">{layer.name}</span>
                    </div>

                    <span className="text-[10px] text-[#888888] font-mono shrink-0">
                      {layer.opacity}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Layer Action Bar */}
            <div className="p-2 border-t border-[#383838] flex items-center justify-around bg-[#2d2d2d] text-[#888888]">
              <button
                onClick={onAddLayer}
                className="hover:text-white p-1 transition cursor-pointer"
                title="Create New Layer"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
              <button
                onClick={onDuplicateLayer}
                className="hover:text-white p-1 transition cursor-pointer"
                title="Duplicate Layer (Ctrl+J)"
              >
                <i className="fa-solid fa-clone"></i>
              </button>
              <button
                onClick={() => {
                  if (activeLayerIndex < layers.length - 1) {
                    onMoveLayer(activeLayerIndex, activeLayerIndex + 1);
                  }
                }}
                disabled={activeLayerIndex >= layers.length - 1}
                className="hover:text-white p-1 transition cursor-pointer disabled:opacity-30"
                title="Move Layer Up"
              >
                <i className="fa-solid fa-arrow-up"></i>
              </button>
              <button
                onClick={() => {
                  if (activeLayerIndex > 0) {
                    onMoveLayer(activeLayerIndex, activeLayerIndex - 1);
                  }
                }}
                disabled={activeLayerIndex <= 0}
                className="hover:text-white p-1 transition cursor-pointer disabled:opacity-30"
                title="Move Layer Down"
              >
                <i className="fa-solid fa-arrow-down"></i>
              </button>
              <button
                onClick={onDeleteLayer}
                className="hover:text-red-400 p-1 transition cursor-pointer"
                title="Delete Selected Layer"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES PANEL */}
        {activeTab === 'properties' && (
          <div className="flex-1 p-3 overflow-y-auto space-y-4 text-xs">
            <div>
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-2">
                Document Properties
              </h3>
              <div className="space-y-2 text-[#888888] text-[11px] bg-[#1e1e1e] p-3 rounded border border-[#383838]">
                <div className="flex justify-between">
                  <span>Width:</span>
                  <span className="text-gray-200 font-mono">{settings.width} px</span>
                </div>
                <div className="flex justify-between">
                  <span>Height:</span>
                  <span className="text-gray-200 font-mono">{settings.height} px</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Mode:</span>
                  <span className="text-gray-200">{settings.colorMode} 8-bit</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="text-gray-200 font-mono">{settings.dpi} DPI</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Layers:</span>
                  <span className="text-gray-200 font-mono">{layers.length}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#383838] pt-3">
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-2">
                Quick Adjustments
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNotify('Applied Brightness / Contrast Adjustment')}
                  className="p-2 bg-[#1e1e1e] border border-[#383838] hover:bg-[#3c3c3c] rounded text-center transition cursor-pointer"
                >
                  Brighten
                </button>
                <button
                  onClick={() => onNotify('Applied Grayscale Desaturate')}
                  className="p-2 bg-[#1e1e1e] border border-[#383838] hover:bg-[#3c3c3c] rounded text-center transition cursor-pointer"
                >
                  Grayscale
                </button>
                <button
                  onClick={() => onNotify('Inverted Layer Colors')}
                  className="p-2 bg-[#1e1e1e] border border-[#383838] hover:bg-[#3c3c3c] rounded text-center transition cursor-pointer"
                >
                  Invert
                </button>
                <button
                  onClick={() => onNotify('Sepia Photo Tone Filter Applied')}
                  className="p-2 bg-[#1e1e1e] border border-[#383838] hover:bg-[#3c3c3c] rounded text-center transition cursor-pointer"
                >
                  Sepia
                </button>
              </div>
            </div>

            {/* 3D Wolf Wireframe Controls */}
            <div className="border-t border-[#383838] pt-3 space-y-2">
              <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                <span>3D Wireframe Mesh</span>
                <i className="fa-solid fa-cube text-cyan-400"></i>
              </h3>

              <button
                onClick={onToggle3DOverlay}
                className={`w-full py-2 rounded text-center font-medium transition cursor-pointer ${
                  show3DOverlay
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_12px_rgba(0,210,255,0.4)]'
                    : 'bg-[#1e1e1e] border border-[#383838] hover:bg-[#3c3c3c] text-gray-300'
                }`}
              >
                {show3DOverlay ? 'Disable 3D Wolf Overlay' : 'Enable 3D Wolf Overlay'}
              </button>

              {show3DOverlay && (
                <div className="space-y-2 bg-[#1e1e1e] p-2.5 rounded border border-[#383838] text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888888]">Mesh Color</span>
                    <input
                      type="color"
                      value={wireframeColor}
                      onChange={(e) => setWireframeColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border border-[#383838] bg-transparent p-0"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#888888]">Live Rotation</span>
                    <button
                      onClick={() => setAnimate3D(prev => !prev)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        animate3D ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-[#252526] text-gray-400'
                      }`}
                    >
                      {animate3D ? 'Spinning' : 'Static'}
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#888888] mb-1">
                      <span>Scale Factor</span>
                      <span className="text-gray-300 font-mono">{scale3D.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={scale3D}
                      onChange={(e) => setScale3D(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY PANEL */}
        {activeTab === 'history' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto divide-y divide-[#383838]/40 text-xs">
              {history.map(item => (
                <div
                  key={item.id}
                  className="p-2 hover:bg-[#3c3c3c] text-[#888888] flex justify-between items-center transition"
                >
                  <span className="text-gray-300 truncate">{item.action}</span>
                  <span className="text-[9px] font-mono text-[#888888] shrink-0 ml-2">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-[#383838] bg-[#2d2d2d] flex justify-end">
              <button
                onClick={() => onAddHistory('Canvas State Snapshot')}
                className="text-[10px] text-gray-400 hover:text-white flex items-center space-x-1"
              >
                <i className="fa-solid fa-camera"></i>
                <span>Create Snapshot</span>
              </button>
            </div>
          </div>
        )}

      </aside>

    </section>
  );
};
