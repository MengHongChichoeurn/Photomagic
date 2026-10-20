import React, { useState, useRef, useEffect } from 'react';

interface MenuBarProps {
  onNewFile: () => void;
  onImportClick: () => void;
  onSavePNG: () => void;
  onExportPSD: () => void;
  onReturnHome: () => void;
  onUndo: () => void;
  onClearLayer: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenShortcuts: () => void;
  onApplyFilter: (type: string) => void;
  onNewLayer: () => void;
  onDuplicateLayer: () => void;
  onDeleteLayer: () => void;
  onFlattenLayers: () => void;
  onAddText: () => void;
  onToggle3D: () => void;
  onZoom: (delta: number) => void;
  onResetZoom: () => void;
  onTogglePanel: (panel: 'layers' | 'properties' | 'history') => void;
  onNotify: (msg: string) => void;
  canvasWidth: number;
  canvasHeight: number;
  inWorkspace: boolean;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewFile,
  onImportClick,
  onSavePNG,
  onExportPSD,
  onReturnHome,
  onUndo,
  onClearLayer,
  onOpenSettings,
  onOpenAbout,
  onOpenShortcuts,
  onApplyFilter,
  onNewLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onFlattenLayers,
  onAddText,
  onToggle3D,
  onZoom,
  onResetZoom,
  onTogglePanel,
  onNotify,
  canvasWidth,
  canvasHeight,
  inWorkspace
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(prev => (prev === menuName ? null : menuName));
  };

  const handleItemSelect = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  return (
    <nav
      ref={menuBarRef}
      className="bg-[#252526] border-b border-[#383838] flex items-center px-2 py-0.5 text-xs text-gray-300 select-none z-40 relative"
    >
      <div className="flex items-center space-x-0.5">
        
        {/* 1. File Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('file')}
            onMouseEnter={() => activeMenu && setActiveMenu('file')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'file' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            File
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[210px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(onNewFile)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span className="flex items-center">
                  <i className="fa-solid fa-file-circle-plus mr-2 text-[#007acc]"></i>
                  New File...
                </span>
                <span className="text-[#888888] text-[10px]">Ctrl+N</span>
              </button>
              <button
                onClick={() => handleItemSelect(onImportClick)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span className="flex items-center">
                  <i className="fa-solid fa-folder-open mr-2 text-amber-400"></i>
                  Open / Import...
                </span>
                <span className="text-[#888888] text-[10px]">Ctrl+O</span>
              </button>
              <div className="border-t border-[#383838] my-1"></div>
              <button
                onClick={() => handleItemSelect(onSavePNG)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span className="flex items-center">
                  <i className="fa-solid fa-floppy-disk mr-2 text-emerald-400"></i>
                  Save Workspace PNG
                </span>
                <span className="text-[#888888] text-[10px]">Ctrl+S</span>
              </button>
              <button
                onClick={() => handleItemSelect(onExportPSD)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span className="flex items-center">
                  <i className="fa-solid fa-file-export mr-2 text-purple-400"></i>
                  Export PSD Manifest
                </span>
                <span className="text-[#888888] text-[10px]">Shift+Ctrl+S</span>
              </button>
              <div className="border-t border-[#383838] my-1"></div>
              <button
                onClick={() => handleItemSelect(onReturnHome)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span className="flex items-center">
                  <i className="fa-solid fa-house mr-2 text-cyan-400"></i>
                  Return to Home
                </span>
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('Application Exit Simulated'))}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-red-600 hover:text-white text-left"
              >
                <span className="flex items-center">
                  <i className="fa-solid fa-power-off mr-2 text-red-400"></i>
                  Exit
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Edit Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('edit')}
            onMouseEnter={() => activeMenu && setActiveMenu('edit')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'edit' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Edit
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[200px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(onUndo)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Undo Stroke</span>
                <span className="text-[#888888] text-[10px]">Ctrl+Z</span>
              </button>
              <button
                onClick={() => handleItemSelect(onClearLayer)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Clear Selected Layer</span>
                <span className="text-[#888888] text-[10px]">Del</span>
              </button>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('fill'))}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Fill with Foreground Color</span>
                <span className="text-[#888888] text-[10px]">Alt+Del</span>
              </button>
              <div className="border-t border-[#383838] my-1"></div>
              <button
                onClick={() => handleItemSelect(onOpenSettings)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Preferences...</span>
                <span className="text-[#888888] text-[10px]">Ctrl+K</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Image Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('image')}
            onMouseEnter={() => activeMenu && setActiveMenu('image')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'image' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Image
          </button>
          {activeMenu === 'image' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[210px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('brightness'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Auto Brightness / Contrast
              </button>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('grayscale'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Grayscale Mode
              </button>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('invert'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Invert Colors
              </button>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('sepia'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Sepia Tone
              </button>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('cyber'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left text-cyan-400"
              >
                Cyberpunk Neon Tint
              </button>
            </div>
          )}
        </div>

        {/* 4. Layer Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('layer')}
            onMouseEnter={() => activeMenu && setActiveMenu('layer')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'layer' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Layer
          </button>
          {activeMenu === 'layer' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[200px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(onNewLayer)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>New Layer</span>
                <span className="text-[#888888] text-[10px]">Shift+Ctrl+N</span>
              </button>
              <button
                onClick={() => handleItemSelect(onDuplicateLayer)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Duplicate Layer</span>
                <span className="text-[#888888] text-[10px]">Ctrl+J</span>
              </button>
              <button
                onClick={() => handleItemSelect(onDeleteLayer)}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left text-red-400"
              >
                Delete Active Layer
              </button>
              <div className="border-t border-[#383838] my-1"></div>
              <button
                onClick={() => handleItemSelect(onFlattenLayers)}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Flatten Image
              </button>
            </div>
          )}
        </div>

        {/* 5. Type Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('type')}
            onMouseEnter={() => activeMenu && setActiveMenu('type')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'type' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Type
          </button>
          {activeMenu === 'type' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[200px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(onAddText)}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Add Text Layer
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('Font Engine: Inter & JetBrains Mono Ready'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left text-[#888888]"
              >
                Font Engine Settings
              </button>
            </div>
          )}
        </div>

        {/* 6. Select Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('select')}
            onMouseEnter={() => activeMenu && setActiveMenu('select')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'select' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Select
          </button>
          {activeMenu === 'select' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[190px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(() => onNotify('All Canvas Area Selected (Ctrl+A)'))}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Select All</span>
                <span className="text-[#888888] text-[10px]">Ctrl+A</span>
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('Selection Deselected (Ctrl+D)'))}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Deselect</span>
                <span className="text-[#888888] text-[10px]">Ctrl+D</span>
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('Inverted Selection'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Inverse
              </button>
            </div>
          )}
        </div>

        {/* 7. Filter Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('filter')}
            onMouseEnter={() => activeMenu && setActiveMenu('filter')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'filter' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Filter
          </button>
          {activeMenu === 'filter' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[210px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('blur'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Gaussian Blur Soften
              </button>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('sharpen'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Sharpen High Pass
              </button>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('glow'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Neon Bloom Effect
              </button>
              <div className="border-t border-[#383838] my-1"></div>
              <button
                onClick={() => handleItemSelect(() => onApplyFilter('wolf3d'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left text-cyan-400 font-medium"
              >
                <i className="fa-solid fa-cube mr-2"></i>
                Burn 3D Wolf Wireframe
              </button>
            </div>
          )}
        </div>

        {/* 8. 3D Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('3d')}
            onMouseEnter={() => activeMenu && setActiveMenu('3d')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === '3d' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            3D
          </button>
          {activeMenu === '3d' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[220px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(onToggle3D)}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Toggle 3D Mesh Render</span>
                <i className="fa-solid fa-cube text-cyan-400 text-xs"></i>
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('Wireframe Mesh Shader: High Poly Subdivided'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                3D Facet Wireframe Options
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('3D Camera Reset to Front Angle'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                Reset Camera Orientation
              </button>
            </div>
          )}
        </div>

        {/* 9. View Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('view')}
            onMouseEnter={() => activeMenu && setActiveMenu('view')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'view' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            View
          </button>
          {activeMenu === 'view' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[190px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(() => onZoom(0.1))}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Zoom In (+10%)</span>
                <span className="text-[#888888] text-[10px]">Ctrl++</span>
              </button>
              <button
                onClick={() => handleItemSelect(() => onZoom(-0.1))}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Zoom Out (-10%)</span>
                <span className="text-[#888888] text-[10px]">Ctrl+-</span>
              </button>
              <button
                onClick={() => handleItemSelect(onResetZoom)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Fit on Screen (100%)</span>
                <span className="text-[#888888] text-[10px]">Ctrl+0</span>
              </button>
            </div>
          )}
        </div>

        {/* 10. Plugins Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('plugins')}
            onMouseEnter={() => activeMenu && setActiveMenu('plugins')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'plugins' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Plugins
          </button>
          {activeMenu === 'plugins' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[220px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(() => onNotify('kennmagic Core Vector Engine v2.4 Active'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <i className="fa-solid fa-bolt mr-2 text-amber-400"></i>
                Magic Vector Engine
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('PSD / TIF Multi-Layer Parser Ready'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <i className="fa-solid fa-layer-group mr-2 text-purple-400"></i>
                PSD / TIF Import Plugin
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('Client-side Neural Retouch Engine Mounted'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <i className="fa-solid fa-wand-magic-sparkles mr-2 text-cyan-400"></i>
                AI Auto-Enhance Neural
              </button>
            </div>
          )}
        </div>

        {/* 11. Window Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('window')}
            onMouseEnter={() => activeMenu && setActiveMenu('window')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'window' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Window
          </button>
          {activeMenu === 'window' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[190px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(() => onTogglePanel('layers'))}
                className="w-full flex justify-between items-center px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Layers Dock</span>
                <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
              </button>
              <button
                onClick={() => handleItemSelect(() => onTogglePanel('properties'))}
                className="w-full flex justify-between items-center px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Properties Panel</span>
                <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
              </button>
              <button
                onClick={() => handleItemSelect(() => onTogglePanel('history'))}
                className="w-full flex justify-between items-center px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>History Panel</span>
                <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
              </button>
            </div>
          )}
        </div>

        {/* 12. Help Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('help')}
            onMouseEnter={() => activeMenu && setActiveMenu('help')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              activeMenu === 'help' ? 'bg-[#3c3c3c] text-white' : 'hover:bg-[#3c3c3c] hover:text-white'
            }`}
          >
            Help
          </button>
          {activeMenu === 'help' && (
            <div className="absolute left-0 top-full bg-[#252526] border border-[#383838] shadow-2xl py-1 min-w-[210px] z-50 rounded-b">
              <button
                onClick={() => handleItemSelect(onOpenAbout)}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                About Photo Magic...
              </button>
              <button
                onClick={() => handleItemSelect(onOpenShortcuts)}
                className="w-full flex justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                <span>Keyboard Shortcuts</span>
                <span className="text-[#888888] text-[10px]">?</span>
              </button>
              <button
                onClick={() => handleItemSelect(() => onNotify('System Diagnostics: WebGL 2.0 GPU Accelerated'))}
                className="w-full px-3 py-1.5 hover:bg-[#007acc] hover:text-white text-left"
              >
                System Diagnostics
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Right Side Toolbar Stats */}
      <div className="ml-auto flex items-center space-x-3 text-[11px] text-[#888888]">
        <span className="hidden md:flex items-center">
          <i className="fa-solid fa-microchip mr-1.5 text-cyan-400"></i>
          <span>RAM:&nbsp;</span>
          <span className="text-gray-300 font-mono">1.2 GB / 16 GB</span>
        </span>
        {inWorkspace && (
          <span className="bg-[#1e1e1e] border border-[#383838] px-2 py-0.5 rounded text-gray-300 font-mono text-[10px]">
            {canvasWidth} &times; {canvasHeight} px
          </span>
        )}
      </div>
    </nav>
  );
};
