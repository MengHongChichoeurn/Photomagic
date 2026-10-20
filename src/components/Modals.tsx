import React, { useState } from 'react';
import { WolfLogo } from './WolfLogo';
import { DocumentSettings, OSMode } from '../types';

// ================= 1. NEW FILE MODAL =================
interface NewFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (settings: DocumentSettings) => void;
}

export const NewFileModal: React.FC<NewFileModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('Untitled Project 1');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [dpi, setDpi] = useState(300);
  const [colorMode, setColorMode] = useState<'RGB' | 'CMYK' | 'Grayscale'>('RGB');
  const [background, setBackground] = useState<'white' | 'dark' | 'transparent'>('white');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name: name.trim() || 'Untitled Project',
      width: Math.max(100, Math.min(8000, width)),
      height: Math.max(100, Math.min(8000, height)),
      dpi,
      colorMode,
      background
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 glass-effect flex items-center justify-center p-4 select-none">
      <div className="bg-[#252526] border border-[#383838] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#2d2d2d] px-4 py-3 border-b border-[#383838] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-file-circle-plus text-[#007acc]"></i>
            <h3 className="font-bold text-gray-200 text-sm">New Document - Photo Magic</h3>
          </div>
          <button onClick={onClose} className="text-[#888888] hover:text-white cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-[#888888] mb-1">Document Preset Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#383838] rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-[#007acc]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888888] mb-1">Width (px)</label>
              <input
                type="number"
                min="100"
                max="8000"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 100)}
                className="w-full bg-[#1e1e1e] border border-[#383838] rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-[#007acc]"
              />
            </div>
            <div>
              <label className="block text-[#888888] mb-1">Height (px)</label>
              <input
                type="number"
                min="100"
                max="8000"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                className="w-full bg-[#1e1e1e] border border-[#383838] rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-[#007acc]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888888] mb-1">Resolution (DPI)</label>
              <select
                value={dpi}
                onChange={(e) => setDpi(parseInt(e.target.value))}
                className="w-full bg-[#1e1e1e] border border-[#383838] rounded px-3 py-2 text-gray-200 focus:outline-none"
              >
                <option value="72">72 DPI (Web)</option>
                <option value="150">150 DPI (Medium)</option>
                <option value="300">300 DPI (High Print)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#888888] mb-1">Color Mode</label>
              <select
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value as any)}
                className="w-full bg-[#1e1e1e] border border-[#383838] rounded px-3 py-2 text-gray-200 focus:outline-none"
              >
                <option value="RGB">RGB Color (8-bit)</option>
                <option value="CMYK">CMYK Color (Print)</option>
                <option value="Grayscale">Grayscale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#888888] mb-1">Background Contents</label>
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value as any)}
              className="w-full bg-[#1e1e1e] border border-[#383838] rounded px-3 py-2 text-gray-200 focus:outline-none"
            >
              <option value="white">White (#ffffff)</option>
              <option value="dark">Photoshop Dark (#1e1e1e)</option>
              <option value="transparent">Transparent Checkerboard</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[#383838] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#3c3c3c] border border-[#383838] text-gray-300 rounded font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#007acc] hover:bg-[#0098ff] text-white rounded font-medium shadow-md cursor-pointer"
            >
              Create Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= 2. SETTINGS & PREFERENCES MODAL =================
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  osMode: OSMode;
  onSetOS: (os: OSMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onToggleAdmin,
  osMode,
  onSetOS
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 glass-effect flex items-center justify-center p-4 select-none">
      <div className="bg-[#252526] border border-[#383838] rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2d2d2d] px-4 py-3 border-b border-[#383838] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-sliders text-[#007acc]"></i>
            <h3 className="font-bold text-gray-200 text-sm">Preferences & System Settings</h3>
          </div>
          <button onClick={onClose} className="text-[#888888] hover:text-white cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs overflow-y-auto max-h-[75vh]">
          {/* Owner Identity Badge */}
          <div className="p-4 bg-[#1e1e1e] border border-[#383838] rounded-lg flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-gray-200">Photo Magic Core Launcher</div>
              <div className="text-[#888888]">
                Owned &amp; Created by <strong className="text-[#0098ff]">kennmagic</strong>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-[#007acc]/20 border border-[#007acc]/40 text-[#0098ff] font-semibold rounded text-[10px]">
              VERIFIED OWNER
            </span>
          </div>

          {/* Admin Mode Toggle Box */}
          <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-lg flex items-center justify-between">
            <div className="space-y-0.5 max-w-sm">
              <div className="font-bold text-amber-300">Run as Administrator</div>
              <div className="text-[#888888]">
                Grant elevated filesystem privileges, multithreaded vector processing, and direct GPU buffer access.
              </div>
            </div>
            <button
              onClick={onToggleAdmin}
              className={`px-3.5 py-1.5 rounded font-medium text-xs cursor-pointer transition ${
                isAdmin
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-[#3c3c3c] hover:bg-[#4a4a4a] text-gray-300 border border-[#383838]'
              }`}
            >
              {isAdmin ? 'Elevated Active' : 'Switch to Admin'}
            </button>
          </div>

          {/* OS Environment Simulator */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-200 block uppercase tracking-wider text-[11px]">
              OS Environment Simulation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => onSetOS('win')}
                className={`p-3.5 bg-[#1e1e1e] border rounded-lg flex items-center space-x-3 cursor-pointer transition ${
                  osMode === 'win'
                    ? 'border-[#007acc] bg-[#007acc]/10 shadow-[0_0_10px_rgba(0,122,204,0.2)]'
                    : 'border-[#383838] hover:border-gray-500'
                }`}
              >
                <i className="fa-brands fa-windows text-2xl text-blue-400"></i>
                <div>
                  <div className="font-bold text-gray-200">Windows 11 OS</div>
                  <div className="text-[10px] text-[#888888]">DirectX / Win32 Shell</div>
                </div>
              </div>

              <div
                onClick={() => onSetOS('mac')}
                className={`p-3.5 bg-[#1e1e1e] border rounded-lg flex items-center space-x-3 cursor-pointer transition ${
                  osMode === 'mac'
                    ? 'border-[#007acc] bg-[#007acc]/10 shadow-[0_0_10px_rgba(0,122,204,0.2)]'
                    : 'border-[#383838] hover:border-gray-500'
                }`}
              >
                <i className="fa-brands fa-apple text-2xl text-gray-200"></i>
                <div>
                  <div className="font-bold text-gray-200">macOS Sonoma</div>
                  <div className="text-[10px] text-[#888888]">Metal / Apple Silicon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Memory Metrics */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-200 block uppercase tracking-wider text-[11px]">
              Performance &amp; Hardware Acceleration
            </label>
            <div className="space-y-3 p-3 bg-[#1e1e1e] border border-[#383838] rounded-lg text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-[#888888]">GPU Acceleration</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <i className="fa-solid fa-check text-xs mr-1"></i> Enabled (WebGL 2.0 / WebGPU Ready)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888888]">Scratch Disk Space</span>
                <span className="text-gray-200 font-mono">248.5 GB Available on NVMe</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888888]">Undo History Limit</span>
                <span className="text-gray-200 font-mono">50 States (Auto Prune)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#2d2d2d] px-4 py-3 border-t border-[#383838] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0098ff] text-white rounded font-medium cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= 3. ABOUT PHOTO MAGIC MODAL =================
interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 glass-effect flex items-center justify-center p-4 select-none">
      <div className="bg-[#252526] border border-[#383838] rounded-xl shadow-2xl max-w-md w-full p-6 text-center space-y-4">
        <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden shadow-2xl border border-[#383838]">
          <WolfLogo size={80} glow={true} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Photo Magic</h2>
          <p className="text-xs text-[#0098ff] font-semibold mt-0.5">Desktop Launcher &amp; Image Suite</p>
          <p className="text-xs text-[#888888] mt-2 leading-relaxed">
            Designed with a 70%+ Adobe Photoshop layout aesthetic, supporting multi-layer rendering,
            dynamic blend modes, and 3D wireframe mesh overlays.
          </p>
        </div>
        <div className="p-3 bg-[#1e1e1e] border border-[#383838] rounded text-xs text-[#888888] space-y-1">
          <div>Owner &amp; Creator: <strong className="text-gray-200">kennmagic</strong></div>
          <div>Engine Target: <strong className="text-gray-200">Windows 11 / macOS Sonoma</strong></div>
          <div>Release: <strong className="text-gray-200">v2026.4 Pro</strong></div>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-[#007acc] hover:bg-[#0098ff] text-white text-xs rounded font-medium w-full cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// ================= 4. KEYBOARD SHORTCUTS MODAL =================
interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'V', desc: 'Move Tool' },
    { key: 'M', desc: 'Rectangular Marquee' },
    { key: 'L', desc: 'Lasso Selection' },
    { key: 'B', desc: 'Brush Tool' },
    { key: 'E', desc: 'Eraser Tool' },
    { key: 'P', desc: 'Pen Tool' },
    { key: 'T', desc: 'Horizontal Type Tool' },
    { key: 'U', desc: 'Shape / Vector Tool' },
    { key: 'I', desc: 'Eyedropper Tool' },
    { key: 'X', desc: 'Swap Foreground & Background Colors' },
    { key: 'D', desc: 'Reset to Black & White' },
    { key: 'Ctrl + N', desc: 'New Document' },
    { key: 'Ctrl + O', desc: 'Open / Import Image' },
    { key: 'Ctrl + S', desc: 'Save PNG Artwork' },
    { key: 'Ctrl + Z', desc: 'Undo' },
    { key: 'Ctrl + J', desc: 'Duplicate Active Layer' },
    { key: 'Del', desc: 'Clear Active Layer' },
    { key: 'Ctrl + K', desc: 'Preferences & Settings' }
  ];

  return (
    <div className="fixed inset-0 z-50 glass-effect flex items-center justify-center p-4 select-none">
      <div className="bg-[#252526] border border-[#383838] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        <div className="bg-[#2d2d2d] px-4 py-3 border-b border-[#383838] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-keyboard text-[#007acc]"></i>
            <h3 className="font-bold text-gray-200 text-sm">Keyboard Shortcuts Guide</h3>
          </div>
          <button onClick={onClose} className="text-[#888888] hover:text-white cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[65vh] space-y-1.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            {shortcuts.map((s, idx) => (
              <div key={idx} className="p-2 bg-[#1e1e1e] border border-[#383838] rounded flex items-center justify-between">
                <span className="text-[#888888]">{s.desc}</span>
                <kbd className="px-1.5 py-0.5 bg-[#2d2d2d] border border-[#383838] rounded font-mono text-[10px] text-[#0098ff]">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2d2d2d] px-4 py-3 border-t border-[#383838] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0098ff] text-white rounded font-medium cursor-pointer text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
