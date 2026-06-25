import React from 'react';

interface LogoProps {
  showText?: boolean;
  className?: string;
  iconSize?: number; // width/height of the icon SVG
  textColor?: string; // custom text class
}

export default function Logo({
  showText = true,
  className = '',
  iconSize = 40,
  textColor = 'text-white'
}: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* High-Fidelity Custom SVG Logo Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Main D Gradient - Bright Blue to Deep Indigo */}
          <linearGradient id="dGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0082FF" />
            <stop offset="50%" stopColor="#0052D4" />
            <stop offset="100%" stopColor="#001C4E" />
          </linearGradient>

          {/* Active Tick / Checkmark Gradient */}
          <linearGradient id="tickGrad" x1="40" y1="80" x2="110" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052D4" />
            <stop offset="60%" stopColor="#0082FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* W Inner Shadow / Dark Gradient */}
          <linearGradient id="wGrad" x1="15" y1="40" x2="70" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#001F54" />
            <stop offset="100%" stopColor="#0A2540" />
          </linearGradient>

          {/* Drop shadow filter for extra depth */}
          <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. Main 'D' Shape Background */}
        <path
          d="M 25,20 H 75 C 98,20 110,35 110,60 C 110,85 98,100 75,100 H 25 Z"
          fill="url(#dGrad)"
        />
        
        {/* 'D' Inner Cutout (Hole) */}
        <path
          d="M 45,38 H 70 C 82,38 88,45 88,60 C 88,75 82,82 70,82 H 45 Z"
          fill="#030014" /* Matches page deep backdrop color */
        />

        {/* 2. Overlapping 'W' Shape on Left */}
        <path
          d="M 20,40 L 38,95 L 53,55 L 68,95 L 86,40 H 72 L 60,78 L 48,45 H 42 L 30,78 L 18,40 Z"
          fill="url(#wGrad)"
          filter="url(#logoShadow)"
        />

        {/* 3. Dynamic Rising Tick / Checkmark (Active Success Indicator) */}
        <path
          d="M 46,72 L 60,54 L 75,68 L 108,28 L 115,36 L 75,85 Z"
          fill="url(#tickGrad)"
          filter="url(#logoShadow)"
        />

        {/* 4. Digital Flow Pixels (Square blocks top-right) */}
        <rect x="108" y="14" width="6" height="6" fill="#38BDF8" />
        <rect x="114" y="20" width="6" height="6" fill="#0082FF" />
        <rect x="102" y="22" width="5" height="5" fill="#00D2FF" />
        <rect x="108" y="28" width="5" height="5" fill="#0052D4" />
        <rect x="114" y="34" width="4" height="4" fill="#38BDF8" />
        <rect x="96" y="28" width="4" height="4" fill="#0082FF" />
      </svg>

      {/* Corporate Typography Brand */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-display font-extrabold text-lg tracking-wider uppercase leading-none ${textColor}`}>
            DESHWAL
          </span>
          <span className="text-[9px] block text-blue-400 font-bold tracking-widest uppercase mt-0.5 whitespace-nowrap">
            Web Technologies
          </span>
        </div>
      )}
    </div>
  );
}
