import React, { useRef, useState } from 'react';
import { WolfLogo } from './WolfLogo';
import { RecentFile } from '../types';

interface HomeLauncherProps {
  onOpenNewModal: () => void;
  onOpenSettings: () => void;
  onSelectPreset: (width: number, height: number, name: string, starterArt?: string) => void;
  recentFiles: RecentFile[];
  onOpenRecentFile: (file: RecentFile) => void;
  onClearRecentFiles: () => void;
  onFileImport: (file: File) => void;
}

export const HomeLauncher: React.FC<HomeLauncherProps> = ({
  onOpenNewModal,
  onOpenSettings,
  onSelectPreset,
  recentFiles,
  onOpenRecentFile,
  onClearRecentFiles,
  onFileImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileImport(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileImport(e.target.files[0]);
    }
  };

  return (
    <section className="w-full h-full flex flex-col bg-[#1e1e1e] p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        
        {/* Welcome Hero Header */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#252526] border border-[#383838] rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-[#007acc]">
            <i className="fa-solid fa-wand-magic-sparkles text-[240px]"></i>
          </div>

          <div className="space-y-3 z-10 max-w-xl">
            <div className="flex items-center space-x-3">
              <span className="bg-[#007acc]/20 text-[#0098ff] border border-[#007acc]/40 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                Photoshop 70%+ Engine
              </span>
              <span className="text-xs text-[#888888]">
                Owned by <strong className="text-gray-200">kennmagic</strong>
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight">
              Photo Magic Desktop Launcher
            </h1>

            <p className="text-[#888888] text-sm leading-relaxed">
              High-fidelity creative workspace with multi-format importer (PNG, JPG, SVG, PSD, TIF),
              multi-layer compositing engine, 3D low-poly wireframe mesh rendering, and desktop administrator controls.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenNewModal}
                className="px-5 py-2.5 bg-[#007acc] hover:bg-[#0098ff] text-white font-medium rounded-lg text-sm flex items-center space-x-2 shadow-lg shadow-[#007acc]/20 transition transform active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                <span>Create New File</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-gray-200 border border-[#383838] font-medium rounded-lg text-sm flex items-center space-x-2 transition transform active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-folder-open text-amber-400 text-xs"></i>
                <span>Open / Import Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.psd,.tif,.tiff"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <button
                onClick={onOpenSettings}
                className="px-4 py-2.5 bg-[#252526] hover:bg-[#3c3c3c] border border-[#383838] text-gray-300 rounded-lg text-sm transition cursor-pointer flex items-center"
              >
                <i className="fa-solid fa-gear mr-1.5 text-gray-400"></i>
                <span>App Settings</span>
              </button>
            </div>
          </div>

          {/* App Icon Showcase Badge */}
          <div className="mt-6 md:mt-0 flex flex-col items-center justify-center p-4 bg-[#2d2d2d]/90 border border-[#383838] rounded-xl z-10 w-48 text-center shadow-lg">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-[#383838] mb-3 relative group">
              <WolfLogo size={96} glow={true} />
            </div>
            <span className="text-xs font-bold text-gray-200">3D Wolf Structure</span>
            <span className="text-[10px] text-[#888888]">Official Icon Badge</span>
            <span className="text-[9px] text-[#0098ff] font-mono mt-1">kennmagic Engine</span>
          </div>
        </div>

        {/* Preset Templates Quick Launch Grid */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#888888] mb-4 flex items-center">
            <i className="fa-solid fa-shapes mr-2 text-[#007acc]"></i>
            Preset Canvas Sizes & Templates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div
              onClick={() => onSelectPreset(1920, 1080, 'Full HD Desktop')}
              className="p-3.5 bg-[#252526] hover:bg-[#3c3c3c] border border-[#383838] hover:border-[#007acc] rounded-lg cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-desktop text-xl text-blue-400 group-hover:scale-110 transition"></i>
                <span className="text-[10px] bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#888888]">16:9</span>
              </div>
              <div className="text-xs font-semibold text-gray-200">Full HD Desktop</div>
              <div className="text-[11px] text-[#888888]">1920 &times; 1080 px</div>
              <div className="text-[10px] text-gray-400">300 DPI High Print</div>
            </div>

            <div
              onClick={() => onSelectPreset(3840, 2160, '4K Artwork Canvas')}
              className="p-3.5 bg-[#252526] hover:bg-[#3c3c3c] border border-[#383838] hover:border-[#007acc] rounded-lg cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-tv text-xl text-purple-400 group-hover:scale-110 transition"></i>
                <span className="text-[10px] bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#888888]">UHD</span>
              </div>
              <div className="text-xs font-semibold text-gray-200">4K Artwork</div>
              <div className="text-[11px] text-[#888888]">3840 &times; 2160 px</div>
              <div className="text-[10px] text-gray-400">Ultra High Detail</div>
            </div>

            <div
              onClick={() => onSelectPreset(1080, 1080, 'Social Square Post')}
              className="p-3.5 bg-[#252526] hover:bg-[#3c3c3c] border border-[#383838] hover:border-[#007acc] rounded-lg cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <i className="fa-brands fa-instagram text-xl text-pink-400 group-hover:scale-110 transition"></i>
                <span className="text-[10px] bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#888888]">1:1</span>
              </div>
              <div className="text-xs font-semibold text-gray-200">Social Square</div>
              <div className="text-[11px] text-[#888888]">1080 &times; 1080 px</div>
              <div className="text-[10px] text-gray-400">Instagram / Feed</div>
            </div>

            <div
              onClick={() => onSelectPreset(800, 600, 'Compact Illustration')}
              className="p-3.5 bg-[#252526] hover:bg-[#3c3c3c] border border-[#383838] hover:border-[#007acc] rounded-lg cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-palette text-xl text-emerald-400 group-hover:scale-110 transition"></i>
                <span className="text-[10px] bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#888888]">4:3</span>
              </div>
              <div className="text-xs font-semibold text-gray-200">Illustration</div>
              <div className="text-[11px] text-[#888888]">800 &times; 600 px</div>
              <div className="text-[10px] text-gray-400">Classic Canvas</div>
            </div>

            <div
              onClick={() => onSelectPreset(1080, 1920, 'Mobile Story Reel')}
              className="p-3.5 bg-[#252526] hover:bg-[#3c3c3c] border border-[#383838] hover:border-[#007acc] rounded-lg cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-mobile-screen text-xl text-amber-400 group-hover:scale-110 transition"></i>
                <span className="text-[10px] bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#888888]">9:16</span>
              </div>
              <div className="text-xs font-semibold text-gray-200">Mobile Story</div>
              <div className="text-[11px] text-[#888888]">1080 &times; 1920 px</div>
              <div className="text-[10px] text-gray-400">TikTok / Reels</div>
            </div>

            <div
              onClick={() => onSelectPreset(1600, 900, '3D Wolf Cyber Artwork', 'wolf-starter')}
              className="p-3.5 bg-[#252526] hover:bg-[#3c3c3c] border border-cyan-500/40 hover:border-cyan-400 rounded-lg cursor-pointer transition group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-bl">
                SPECIAL
              </div>
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-cube text-xl text-cyan-400 group-hover:scale-110 transition"></i>
                <span className="text-[10px] bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#888888]">3D</span>
              </div>
              <div className="text-xs font-semibold text-cyan-300">Wolf 3D Concept</div>
              <div className="text-[11px] text-[#888888]">1600 &times; 900 px</div>
              <div className="text-[10px] text-cyan-400 font-medium">Pre-rendered Mesh</div>
            </div>

          </div>
        </div>

        {/* Recent Projects Section & Drag/Drop Target */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#888888] flex items-center justify-between">
              <span>
                <i className="fa-solid fa-clock-rotate-left mr-2 text-[#007acc]"></i>
                Recent Files
              </span>
              {recentFiles.length > 0 && (
                <button
                  onClick={onClearRecentFiles}
                  className="text-xs text-[#888888] hover:text-white transition cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </h2>

            {recentFiles.length === 0 ? (
              <div className="p-8 bg-[#252526] border border-[#383838] rounded-xl text-center text-[#888888] text-xs">
                No recent files yet. Create a new file or drag and drop an image to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {recentFiles.map(file => {
                  let badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                  let icon = 'fa-file-image text-blue-400';

                  if (file.format === 'PSD') {
                    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                    icon = 'fa-layer-group text-purple-400';
                  } else if (file.format === 'SVG') {
                    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                    icon = 'fa-vector-square text-amber-400';
                  } else if (file.format === 'TIF') {
                    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                    icon = 'fa-file-waveform text-emerald-400';
                  }

                  return (
                    <div
                      key={file.id}
                      onClick={() => onOpenRecentFile(file)}
                      className="p-3 bg-[#252526] hover:bg-[#3c3c3c] border border-[#383838] hover:border-[#007acc] rounded-lg flex items-center justify-between cursor-pointer transition group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded bg-[#1e1e1e] flex items-center justify-center border border-[#383838] group-hover:border-[#007acc]">
                          <i className={`fa-solid ${icon}`}></i>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-200 group-hover:text-[#0098ff] transition flex items-center space-x-2">
                            <span>{file.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${badgeColor}`}>
                              {file.format}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#888888]">
                            {file.width} &times; {file.height} px • {file.size}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#888888] font-mono">{file.date}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dropzone Importer Card */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#888888]">
              <i className="fa-solid fa-file-import mr-2 text-[#007acc]"></i>
              Import Graphics File
            </h2>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer transition h-64 ${
                isDragOver
                  ? 'border-[#007acc] bg-[#007acc]/10 scale-[1.02]'
                  : 'border-[#383838] hover:border-[#007acc] bg-[#252526]/50'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-[#1e1e1e] border border-[#383838] flex items-center justify-center text-[#007acc]">
                <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">Drag & Drop files here</p>
                <p className="text-xs text-[#888888] mt-1">Supports PNG, JPG, SVG, PSD, TIF</p>
              </div>
              <span className="px-3.5 py-1.5 bg-[#3c3c3c] border border-[#383838] text-xs text-gray-300 rounded hover:bg-[#4a4a4a]">
                Browse Local Files
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
