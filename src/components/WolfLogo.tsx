import React from 'react';

interface WolfLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const WolfLogo: React.FC<WolfLogoProps> = ({ className = '', size = 24, glow = false }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded overflow-hidden shrink-0 select-none ${glow ? 'shadow-[0_0_15px_rgba(0,210,255,0.5)]' : 'shadow'} ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        <defs>
          <radialGradient id="wolfBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f2b4c" />
            <stop offset="100%" stopColor="#020b14" />
          </radialGradient>
          <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b4bacd" />
            <stop offset="100%" stopColor="#7a8194" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100" height="100" fill="url(#wolfBg)" rx="4" />
        
        {/* 3D Wolf Wireframe Facets */}
        <g stroke="#0e1724" strokeWidth="1.2" strokeLinejoin="round">
          {/* Forehead & Brow */}
          <polygon points="50,15 35,32 50,42" fill="#a0a5b5" />
          <polygon points="50,15 50,42 65,32" fill="#c0c5d5" />
          {/* Ears */}
          <polygon points="35,32 20,25 30,48" fill="#787e8e" />
          <polygon points="65,32 80,25 70,48" fill="#989ea3" />
          {/* Bridge & Upper Muzzle */}
          <polygon points="50,42 30,48 50,65" fill="#888e9e" />
          <polygon points="50,42 50,65 70,48" fill="#a8aebf" />
          {/* Cheeks */}
          <polygon points="30,48 18,52 32,68" fill="#606573" />
          <polygon points="70,48 82,52 68,68" fill="#808593" />
          {/* Lower Muzzle & Snout */}
          <polygon points="50,65 32,68 50,88" fill="#707584" />
          <polygon points="50,65 50,88 68,68" fill="#9095a4" />
          {/* Chin Flanks */}
          <polygon points="32,68 40,82 50,88" fill="#505562" />
          <polygon points="68,68 60,82 50,88" fill="#686d7a" />
          
          {/* Piercing Neon Cyan Eyes */}
          <polygon points="38,40 45,43 36,46" fill="#00d2ff" stroke="none" filter="url(#neonGlow)" />
          <polygon points="62,40 55,43 64,46" fill="#00d2ff" stroke="none" filter="url(#neonGlow)" />
        </g>
      </svg>
    </div>
  );
};
