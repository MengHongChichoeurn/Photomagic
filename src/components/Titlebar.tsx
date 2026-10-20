import React from 'react';
import { WolfLogo } from './WolfLogo';
import { OSMode } from '../types';

interface TitlebarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  osMode: OSMode;
  onToggleOS: () => void;
  headerTitle: string;
  onHomeClick: () => void;
  onNotify: (msg: string) => void;
}

export const Titlebar: React.FC<TitlebarProps> = ({
  isAdmin,
  onToggleAdmin,
  osMode,
  onToggleOS,
  headerTitle,
  onHomeClick,
  onNotify
}) => {
  return (
    <header className="bg-[#2d2d2d] border-b border-[#383838] h-9 flex items-center justify-between px-3 text-xs shrink-0 z-50 select-none">
      {/* Left: App Icon + Branding + Admin Switcher + OS badge */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onHomeClick}
          className="hover:scale-105 transition-transform cursor-pointer focus:outline-none"
          title="Return to Home Dashboard"
        >
          <WolfLogo size={24} />
        </button>

        <span className="font-bold text-gray-200 tracking-wide text-xs">Photo Magic</span>
        <span className="text-[10px] text-[#888888] bg-[#252526] px-1.5 py-0.5 rounded border border-[#383838] font-mono">
          v2026.4 Pro
        </span>

        {/* Run as Admin Indicator */}
        <button
          onClick={onToggleAdmin}
          className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-medium border transition cursor-pointer ${
            isAdmin
              ? 'bg-amber-950/60 text-amber-400 border-amber-700/60 hover:bg-amber-900/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
              : 'bg-[#252526] text-gray-400 border-[#383838] hover:bg-[#3c3c3c]'
          }`}
          title={isAdmin ? 'Administrator Privileges Enabled' : 'Click to elevate to Administrator'}
        >
          <i className="fa-solid fa-shield-halved text-xs"></i>
          <span>{isAdmin ? 'Run as Administrator' : 'Standard User'}</span>
        </button>

        {/* Platform indicator switch */}
        <div className="hidden sm:flex items-center space-x-1 bg-[#1e1e1e]/80 border border-[#383838] px-2 py-0.5 rounded text-[10px] text-gray-400">
          <i
            className={`text-xs ${
              osMode === 'mac' ? 'fa-brands fa-apple text-gray-300' : 'fa-brands fa-windows text-blue-400'
            }`}
          ></i>
          <span>{osMode === 'mac' ? 'macOS Sonoma Verified' : 'Win 11 Verified'}</span>
        </div>
      </div>

      {/* Center: Project Title / Workspace Doc Name */}
      <div className="hidden lg:block font-medium text-gray-300 text-[11px] truncate max-w-sm text-center">
        {headerTitle}
      </div>

      {/* Right: Window Controls / Platform Switcher */}
      <div className="flex items-center space-x-2">
        {/* OS UI Mode Toggle Button */}
        <button
          onClick={onToggleOS}
          className="text-[11px] text-[#888888] hover:text-white px-2 py-0.5 rounded hover:bg-[#3c3c3c] transition flex items-center space-x-1.5"
          title="Switch OS Window Frame Style (Win 11 / macOS)"
        >
          <i className="fa-solid fa-desktop text-[10px]"></i>
          <span>{osMode === 'mac' ? 'macOS Style' : 'Windows Style'}</span>
        </button>

        {/* Dynamic Window Controls: Windows */}
        {osMode === 'win' && (
          <div className="flex items-center space-x-1 text-[#888888]">
            <button
              onClick={() => onNotify('Application Minimized')}
              className="hover:text-white px-2 py-0.5 hover:bg-[#3c3c3c] rounded transition"
              title="Minimize"
            >
              <i className="fa-solid fa-minus text-[10px]"></i>
            </button>
            <button
              onClick={() => onNotify('Window Maximized / Restored')}
              className="hover:text-white px-2 py-0.5 hover:bg-[#3c3c3c] rounded transition"
              title="Maximize"
            >
              <i className="fa-regular fa-square text-[10px]"></i>
            </button>
            <button
              onClick={() => onNotify('Exit simulation triggered')}
              className="hover:bg-red-600 hover:text-white px-2 py-0.5 rounded transition"
              title="Close"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        )}

        {/* Dynamic Window Controls: macOS Traffic Lights */}
        {osMode === 'mac' && (
          <div className="flex items-center space-x-1.5 pl-2">
            <button
              onClick={() => onNotify('macOS Window Closed')}
              className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition cursor-pointer"
              title="Close"
            />
            <button
              onClick={() => onNotify('macOS Window Minimized')}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:opacity-80 transition cursor-pointer"
              title="Minimize"
            />
            <button
              onClick={() => onNotify('macOS Window Fullscreen Toggle')}
              className="w-3 h-3 rounded-full bg-green-500 hover:opacity-80 transition cursor-pointer"
              title="Zoom / Fullscreen"
            />
          </div>
        )}
      </div>
    </header>
  );
};
