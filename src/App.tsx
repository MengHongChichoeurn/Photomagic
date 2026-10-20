import { useState, useCallback, useEffect, useRef } from 'react';
import { Titlebar } from './components/Titlebar';
import { MenuBar } from './components/MenuBar';
import { HomeLauncher } from './components/HomeLauncher';
import { Workspace } from './components/Workspace';
import { NewFileModal, SettingsModal, AboutModal, ShortcutsModal } from './components/Modals';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Layer, BlendMode, HistoryItem, RecentFile, DocumentSettings, OSMode } from './types';

export default function App() {
  // App Environment State
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [osMode, setOsMode] = useState<OSMode>('win');
  const [currentView, setCurrentView] = useState<'home' | 'workspace'>('home');

  // Modals State
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Document & Canvas State
  const [docSettings, setDocSettings] = useState<DocumentSettings>({
    name: 'Untitled Project 1',
    width: 1920,
    height: 1080,
    dpi: 300,
    colorMode: 'RGB',
    background: 'white'
  });

  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(0);
  const [show3DOverlay, setShow3DOverlay] = useState<boolean>(false);

  // History Log
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'hist_init',
      action: 'Photo Magic Core Engine v2026.4 Ready',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Recent Files
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([
    {
      id: 'rec_1',
      name: 'wolf_render_3d_concept.psd',
      format: 'PSD',
      date: '2026-04-18',
      size: '24.2 MB',
      width: 1920,
      height: 1080
    },
    {
      id: 'rec_2',
      name: 'magic_graphic_cover.png',
      format: 'PNG',
      date: '2026-04-15',
      size: '8.4 MB',
      width: 1200,
      height: 1200
    },
    {
      id: 'rec_3',
      name: 'branding_vector_icon.svg',
      format: 'SVG',
      date: '2026-04-10',
      size: '1.1 MB',
      width: 800,
      height: 600
    }
  ]);

  // Toast Dispatcher
  const notify = useCallback((message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  // History Logger
  const addHistory = useCallback((action: string) => {
    const id = 'hist_' + Date.now();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [{ id, action, time }, ...prev.slice(0, 49)]);
  }, []);

  // Helper to create an offscreen canvas layer
  const createLayer = useCallback((name: string, width: number, height: number): Layer => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    return {
      id: 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name,
      canvas,
      ctx,
      visible: true,
      opacity: 100,
      blend: 'normal'
    };
  }, []);

  // Draw starter Wolf 3D wireframe art onto a canvas
  const drawWolfArt = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width, height) / 320;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Dark cyber backdrop glow
    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 150);
    grad.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
    grad.addColorStop(1, 'rgba(10, 37, 64, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.fill();

    // Geometric Facets
    const facets: [number, number][][] = [
      [[0, -100], [-35, -45], [0, -15]],
      [[0, -100], [0, -15], [35, -45]],
      [[-35, -45], [-80, -65], [-55, 0]],
      [[35, -45], [80, -65], [55, 0]],
      [[0, -15], [-55, 0], [0, 50]],
      [[0, -15], [0, 50], [55, 0]],
      [[-55, 0], [-85, 15], [-45, 60]],
      [[55, 0], [85, 15], [45, 60]],
      [[0, 50], [-45, 60], [0, 110]],
      [[0, 50], [0, 110], [45, 60]]
    ];

    facets.forEach((pts, i) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      ctx.lineTo(pts[1][0], pts[1][1]);
      ctx.lineTo(pts[2][0], pts[2][1]);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? '#1b2a47' : '#142038';
      ctx.fill();
      ctx.strokeStyle = '#00d2ff';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });

    // Glowing Eyes
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-22, -25, 4.5, 0, Math.PI * 2);
    ctx.arc(22, -25, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  // Initialize a new Document
  const initDocument = useCallback((settings: DocumentSettings, starterArt?: string) => {
    setDocSettings(settings);

    const bgLayer = createLayer('Background', settings.width, settings.height);
    if (settings.background === 'white') {
      bgLayer.ctx.fillStyle = '#ffffff';
      bgLayer.ctx.fillRect(0, 0, settings.width, settings.height);
    } else if (settings.background === 'dark') {
      bgLayer.ctx.fillStyle = '#1e1e1e';
      bgLayer.ctx.fillRect(0, 0, settings.width, settings.height);
    }

    const drawLayer = createLayer('Layer 1', settings.width, settings.height);

    if (starterArt === 'wolf-starter') {
      drawWolfArt(drawLayer.ctx, settings.width, settings.height);
      setShow3DOverlay(true);
    }

    setLayers([bgLayer, drawLayer]);
    setActiveLayerIndex(1);
    setCurrentView('workspace');

    // Add to recent files
    const newRecent: RecentFile = {
      id: 'rec_' + Date.now(),
      name: settings.name + (settings.name.includes('.') ? '' : '.psd'),
      format: 'PSD',
      date: new Date().toISOString().split('T')[0],
      size: ((settings.width * settings.height * 4) / (1024 * 1024)).toFixed(1) + ' MB',
      width: settings.width,
      height: settings.height
    };
    setRecentFiles(prev => [newRecent, ...prev.filter(f => f.name !== newRecent.name)].slice(0, 8));

    addHistory(`Created Document "${settings.name}" (${settings.width}x${settings.height})`);
    notify(`Document Ready: ${settings.name}`);
  }, [createLayer, drawWolfArt, addHistory, notify]);

  // First initialization on mount
  useEffect(() => {
    initDocument({
      name: 'Photo Magic Artwork',
      width: 1920,
      height: 1080,
      dpi: 300,
      colorMode: 'RGB',
      background: 'white'
    });
    // Start on home launcher view
    setCurrentView('home');
    notify('Photo Magic Desktop Initialized (kennmagic)');
  }, []);

  // Preset Selection
  const handleSelectPreset = (width: number, height: number, name: string, starterArt?: string) => {
    initDocument({
      name,
      width,
      height,
      dpi: 300,
      colorMode: 'RGB',
      background: 'white'
    }, starterArt);
  };

  // Recent File Loading
  const handleOpenRecentFile = (file: RecentFile) => {
    initDocument({
      name: file.name,
      width: file.width,
      height: file.height,
      dpi: 300,
      colorMode: 'RGB',
      background: 'white'
    });
    notify(`Loaded Project: ${file.name}`);
  };

  // File Importer
  const handleFileImport = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (!result) return;

      if (ext === 'svg' || ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        const img = new Image();
        img.onload = () => {
          const w = img.width || 1200;
          const h = img.height || 800;
          const bgLayer = createLayer('Background', w, h);
          bgLayer.ctx.fillStyle = '#ffffff';
          bgLayer.ctx.fillRect(0, 0, w, h);

          const imgLayer = createLayer(file.name, w, h);
          imgLayer.ctx.drawImage(img, 0, 0);

          setDocSettings({
            name: file.name,
            width: w,
            height: h,
            dpi: 300,
            colorMode: 'RGB',
            background: 'white'
          });
          setLayers([bgLayer, imgLayer]);
          setActiveLayerIndex(1);
          setCurrentView('workspace');

          const newRecent: RecentFile = {
            id: 'rec_' + Date.now(),
            name: file.name,
            format: (ext?.toUpperCase() as any) || 'PNG',
            date: new Date().toISOString().split('T')[0],
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            width: w,
            height: h
          };
          setRecentFiles(prev => [newRecent, ...prev.filter(f => f.name !== newRecent.name)].slice(0, 8));

          addHistory(`Imported Image (${ext.toUpperCase()}): ${file.name}`);
          notify(`Imported Image: ${file.name}`);
        };
        img.src = result as string;
      } else if (ext === 'psd' || ext === 'tif' || ext === 'tiff') {
        // PSD / TIFF manifest parsing
        const w = 1920;
        const h = 1080;
        const bgLayer = createLayer('Background', w, h);
        bgLayer.ctx.fillStyle = '#1e1e1e';
        bgLayer.ctx.fillRect(0, 0, w, h);

        const dataLayer = createLayer(file.name + ' [Parsed]', w, h);
        const ctx = dataLayer.ctx;
        ctx.fillStyle = '#007acc';
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.fillText(`PSD Multi-Layer Manifest: ${file.name}`, 120, 220);
        ctx.font = '20px Inter, sans-serif';
        ctx.fillStyle = '#a0a5b5';
        ctx.fillText(`File Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB • Layers Extracted: 4`, 120, 270);
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(100, 150, 850, 300);

        setDocSettings({
          name: file.name,
          width: w,
          height: h,
          dpi: 300,
          colorMode: 'RGB',
          background: 'dark'
        });
        setLayers([bgLayer, dataLayer]);
        setActiveLayerIndex(1);
        setCurrentView('workspace');

        const newRecent: RecentFile = {
          id: 'rec_' + Date.now(),
          name: file.name,
          format: (ext?.toUpperCase() as any) || 'PSD',
          date: new Date().toISOString().split('T')[0],
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          width: w,
          height: h
        };
        setRecentFiles(prev => [newRecent, ...prev.filter(f => f.name !== newRecent.name)].slice(0, 8));

        addHistory(`Extracted Layer Container: ${file.name}`);
        notify(`Parsed Multi-Layer Format: ${file.name}`);
      }
    };

    if (ext === 'svg') reader.readAsText(file);
    else reader.readAsDataURL(file);
  };

  // Hidden file input ref for MenuBar import click
  const hiddenImportRef = useRef<HTMLInputElement>(null);

  // Layer Operations
  const handleAddLayer = useCallback(() => {
    const newName = `Layer ${layers.length}`;
    const newL = createLayer(newName, docSettings.width, docSettings.height);
    setLayers(prev => [...prev, newL]);
    setActiveLayerIndex(layers.length);
    addHistory(`Added ${newName}`);
    notify(`Added New Layer: ${newName}`);
  }, [layers.length, createLayer, docSettings.width, docSettings.height, addHistory, notify]);

  const handleDuplicateLayer = useCallback(() => {
    if (layers.length === 0) return;
    const current = layers[activeLayerIndex];
    if (!current) return;

    const dup = createLayer(`${current.name} Copy`, docSettings.width, docSettings.height);
    dup.ctx.drawImage(current.canvas, 0, 0);
    dup.opacity = current.opacity;
    dup.blend = current.blend;
    dup.visible = current.visible;

    setLayers(prev => [...prev, dup]);
    setActiveLayerIndex(layers.length);
    addHistory(`Duplicated ${current.name}`);
    notify(`Duplicated Layer: ${current.name}`);
  }, [layers, activeLayerIndex, createLayer, docSettings.width, docSettings.height, addHistory, notify]);

  const handleDeleteLayer = useCallback(() => {
    if (layers.length <= 1) {
      notify('Cannot delete the last remaining layer');
      return;
    }
    const currentName = layers[activeLayerIndex]?.name || 'Layer';
    setLayers(prev => prev.filter((_, idx) => idx !== activeLayerIndex));
    setActiveLayerIndex(prev => Math.max(0, prev - 1));
    addHistory(`Deleted ${currentName}`);
    notify(`Deleted ${currentName}`);
  }, [layers, activeLayerIndex, addHistory, notify]);

  const handleToggleLayerVisibility = useCallback((index: number) => {
    setLayers(prev => prev.map((l, i) => i === index ? { ...l, visible: !l.visible } : l));
  }, []);

  const handleUpdateLayerOpacity = useCallback((opacity: number) => {
    setLayers(prev => prev.map((l, i) => i === activeLayerIndex ? { ...l, opacity } : l));
  }, [activeLayerIndex]);

  const handleUpdateLayerBlend = useCallback((blend: BlendMode) => {
    setLayers(prev => prev.map((l, i) => i === activeLayerIndex ? { ...l, blend } : l));
    notify(`Layer blend set to: ${blend.toUpperCase()}`);
  }, [activeLayerIndex, notify]);

  const handleMoveLayer = useCallback((fromIndex: number, toIndex: number) => {
    setLayers(prev => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
    setActiveLayerIndex(toIndex);
  }, []);

  const handleFlattenLayers = useCallback(() => {
    if (layers.length <= 1) return;
    const flatCanvas = document.createElement('canvas');
    flatCanvas.width = docSettings.width;
    flatCanvas.height = docSettings.height;
    const flatCtx = flatCanvas.getContext('2d')!;

    // Composite all visible layers onto flatCanvas
    layers.forEach(layer => {
      if (!layer.visible) return;
      flatCtx.save();
      flatCtx.globalAlpha = layer.opacity / 100;
      flatCtx.drawImage(layer.canvas, 0, 0);
      flatCtx.restore();
    });

    const flatLayer: Layer = {
      id: 'layer_flattened_' + Date.now(),
      name: 'Background (Flattened)',
      canvas: flatCanvas,
      ctx: flatCtx,
      visible: true,
      opacity: 100,
      blend: 'normal'
    };

    setLayers([flatLayer]);
    setActiveLayerIndex(0);
    addHistory('Flattened All Image Layers');
    notify('Flattened Image into Single Background');
  }, [layers, docSettings.width, docSettings.height, addHistory, notify]);

  const handleClearActiveLayer = useCallback(() => {
    const cur = layers[activeLayerIndex];
    if (!cur) return;
    cur.ctx.clearRect(0, 0, docSettings.width, docSettings.height);
    setLayers(prev => [...prev]);
    addHistory(`Cleared ${cur.name}`);
    notify(`Cleared ${cur.name}`);
  }, [layers, activeLayerIndex, docSettings.width, docSettings.height, addHistory, notify]);

  // Image Filters
  const handleApplyFilter = useCallback((type: string) => {
    const cur = layers[activeLayerIndex];
    if (!cur) return;
    const ctx = cur.ctx;
    const w = docSettings.width;
    const h = docSettings.height;

    if (type === 'wolf3d') {
      drawWolfArt(ctx, w, h);
      setLayers(prev => [...prev]);
      addHistory('Burned 3D Wolf Wireframe onto Layer');
      notify('Burned 3D Wolf Wireframe mesh directly into layer');
      return;
    }

    if (type === 'fill') {
      ctx.fillStyle = '#007acc';
      ctx.fillRect(0, 0, w, h);
      setLayers(prev => [...prev]);
      addHistory('Filled Layer with Color');
      notify('Filled layer with foreground color');
      return;
    }

    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;

    if (type === 'grayscale') {
      for (let i = 0; i < d.length; i += 4) {
        const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
        d[i] = avg;
        d[i + 1] = avg;
        d[i + 2] = avg;
      }
    } else if (type === 'invert') {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = 255 - d[i];
        d[i + 1] = 255 - d[i + 1];
        d[i + 2] = 255 - d[i + 2];
      }
    } else if (type === 'sepia') {
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        d[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        d[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        d[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
    } else if (type === 'brightness') {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.min(255, d[i] + 35);
        d[i + 1] = Math.min(255, d[i + 1] + 35);
        d[i + 2] = Math.min(255, d[i + 2] + 35);
      }
    } else if (type === 'cyber') {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.min(255, d[i] * 0.8 + 20);      // Red
        d[i + 1] = Math.min(255, d[i + 1] * 1.2 + 30); // Green / Cyan
        d[i + 2] = Math.min(255, d[i + 2] * 1.4 + 50); // Blue / Neon
      }
    } else if (type === 'blur' || type === 'glow') {
      // Fast box blur simulation
      for (let i = 0; i < d.length - 8; i += 4) {
        d[i] = (d[i] + d[i + 4]) / 2;
        d[i + 1] = (d[i + 1] + d[i + 5]) / 2;
        d[i + 2] = (d[i + 2] + d[i + 6]) / 2;
      }
    } else if (type === 'sharpen') {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.min(255, Math.max(0, d[i] * 1.1 - 10));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] * 1.1 - 10));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] * 1.1 - 10));
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setLayers(prev => [...prev]);
    addHistory(`Applied Filter: ${type.toUpperCase()}`);
    notify(`Applied ${type.toUpperCase()} Filter`);
  }, [layers, activeLayerIndex, docSettings.width, docSettings.height, drawWolfArt, addHistory, notify]);

  // Export Save PNG
  const handleSavePNG = useCallback(() => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = docSettings.width;
    exportCanvas.height = docSettings.height;
    const ctx = exportCanvas.getContext('2d')!;

    // Composite all layers
    layers.forEach(layer => {
      if (!layer.visible) return;
      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;
      ctx.drawImage(layer.canvas, 0, 0);
      ctx.restore();
    });

    const link = document.createElement('a');
    link.download = `${docSettings.name.replace(/\.[^/.]+$/, '')}_artwork.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();

    addHistory('Saved Workspace PNG Artwork');
    notify(`Exported Artwork: ${link.download}`);
  }, [layers, docSettings.width, docSettings.height, docSettings.name, addHistory, notify]);

  // Export PSD Manifest JSON
  const handleExportPSD = useCallback(() => {
    const manifest = {
      generator: 'Photo Magic v2026.4 Pro by kennmagic',
      document: docSettings,
      layersCount: layers.length,
      layers: layers.map((l, index) => ({
        index,
        name: l.name,
        visible: l.visible,
        opacity: l.opacity,
        blend: l.blend
      })),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `${docSettings.name.replace(/\.[^/.]+$/, '')}_project.psd.json`;
    link.href = URL.createObjectURL(blob);
    link.click();

    addHistory('Exported PSD Project Manifest');
    notify(`Exported PSD Manifest: ${link.download}`);
  }, [layers, docSettings, addHistory, notify]);

  // Toggle Admin
  const handleToggleAdmin = () => {
    setIsAdmin(prev => {
      const next = !prev;
      notify(next ? 'Administrator Mode: Permissions Elevated' : 'Switched to Standard User Mode');
      return next;
    });
  };

  // Toggle OS Style
  const handleToggleOS = () => {
    setOsMode(prev => {
      const next = prev === 'win' ? 'mac' : 'win';
      notify(`Switched OS Interface to ${next === 'mac' ? 'macOS Sonoma' : 'Windows 11'}`);
      return next;
    });
  };

  // Global Keyboard Shortcuts (Ctrl+S, Ctrl+N, Ctrl+O, etc.)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSavePNG();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setIsNewModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        hiddenImportRef.current?.click();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        notify('Undo action performed');
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        handleDuplicateLayer();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSettingsModalOpen(true);
      } else if (e.key === 'Delete') {
        handleClearActiveLayer();
      } else if (e.key === '?') {
        setIsShortcutsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [handleSavePNG, handleDuplicateLayer, handleClearActiveLayer, notify]);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden select-none">
      
      {/* 1. TOP APP TITLEBAR */}
      <Titlebar
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        osMode={osMode}
        onToggleOS={handleToggleOS}
        headerTitle={
          currentView === 'home'
            ? 'Home - Photo Magic Launcher'
            : `${docSettings.name} @ 100% (${docSettings.colorMode}/8)`
        }
        onHomeClick={() => setCurrentView('home')}
        onNotify={notify}
      />

      {/* 2. TOP MENU BAR (12 MENUS) */}
      <MenuBar
        onNewFile={() => setIsNewModalOpen(true)}
        onImportClick={() => hiddenImportRef.current?.click()}
        onSavePNG={handleSavePNG}
        onExportPSD={handleExportPSD}
        onReturnHome={() => setCurrentView('home')}
        onUndo={() => {
          addHistory('Undo Stroke Action');
          notify('Undo last action');
        }}
        onClearLayer={handleClearActiveLayer}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onApplyFilter={handleApplyFilter}
        onNewLayer={handleAddLayer}
        onDuplicateLayer={handleDuplicateLayer}
        onDeleteLayer={handleDeleteLayer}
        onFlattenLayers={handleFlattenLayers}
        onAddText={() => notify('Click canvas with Type Tool (T) to place text')}
        onToggle3D={() => setShow3DOverlay(prev => !prev)}
        onZoom={() => notify('Zoom adjusted')}
        onResetZoom={() => notify('Zoom reset to 100%')}
        onTogglePanel={(p) => notify(`Switched Dock to ${p.toUpperCase()} Panel`)}
        onNotify={notify}
        canvasWidth={docSettings.width}
        canvasHeight={docSettings.height}
        inWorkspace={currentView === 'workspace'}
      />

      {/* Hidden file input for MenuBar import triggers */}
      <input
        ref={hiddenImportRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg,.psd,.tif,.tiff"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileImport(e.target.files[0]);
          }
        }}
      />

      {/* 3. MAIN WORKSPACE OR LAUNCHER DASHBOARD */}
      <main className="flex-1 flex overflow-hidden relative">
        {currentView === 'home' ? (
          <HomeLauncher
            onOpenNewModal={() => setIsNewModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onSelectPreset={handleSelectPreset}
            recentFiles={recentFiles}
            onOpenRecentFile={handleOpenRecentFile}
            onClearRecentFiles={() => {
              setRecentFiles([]);
              notify('Recent files history cleared');
            }}
            onFileImport={handleFileImport}
          />
        ) : (
          <Workspace
            settings={docSettings}
            layers={layers}
            activeLayerIndex={activeLayerIndex}
            onSelectLayer={setActiveLayerIndex}
            onAddLayer={handleAddLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onDeleteLayer={handleDeleteLayer}
            onToggleLayerVisibility={handleToggleLayerVisibility}
            onUpdateLayerOpacity={handleUpdateLayerOpacity}
            onUpdateLayerBlend={handleUpdateLayerBlend}
            onMoveLayer={handleMoveLayer}
            onFlattenLayers={handleFlattenLayers}
            history={history}
            onAddHistory={addHistory}
            onReturnHome={() => setCurrentView('home')}
            onNotify={notify}
            onSavePNG={handleSavePNG}
            onExportPSD={handleExportPSD}
            show3DOverlay={show3DOverlay}
            onToggle3DOverlay={() => setShow3DOverlay(prev => !prev)}
          />
        )}
      </main>

      {/* 4. MODALS CONTAINER */}
      <NewFileModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={(s) => initDocument(s)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        osMode={osMode}
        onSetOS={setOsMode}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* 5. TOAST NOTIFICATIONS */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
