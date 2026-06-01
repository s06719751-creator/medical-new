import React from 'react';
import heroBodyImg from '../assets/hero_body.png';

/**
 * AnimatedBody component
 * Renders the stunning 3D futuristic holographic medical human anatomical body scan,
 * nested inside dynamic neon orbits and floating clinical diagnostic sensors.
 * Styled with a radial transparency mask to blend seamlessly into the dark page background.
 */
export const AnimatedBody: React.FC = () => {
  return (
    <div className="relative w-full max-w-[450px] aspect-[4/5] mx-auto flex items-center justify-center select-none overflow-visible">
      {/* Background radial soft light blobs */}
      <div className="absolute w-[280px] h-[280px] bg-purple-600/10 rounded-full blur-[80px] -z-10 animate-pulse" />
      <div className="absolute w-[180px] h-[180px] bg-cyan-500/10 rounded-full blur-[60px] -z-10 bottom-10" />

      {/* Orbiting Ring 1 (Magenta/Cyan gradient orbit) */}
      <div className="absolute w-[360px] h-[360px] border border-dashed border-purple-500/20 rounded-full animate-[spin_30s_linear_infinite]" style={{ transform: 'rotateX(75deg) rotateY(15deg)' }} />
      
      {/* Orbiting Ring 2 (Violent purple orbit) */}
      <div className="absolute w-[420px] h-[420px] border border-cyan-400/20 rounded-full animate-[spin_20s_linear_infinite]" style={{ transform: 'rotateX(60deg) rotateY(-20deg)' }}>
        {/* Glowing orbital micro-node */}
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4] -translate-x-1/2 -translate-y-1/2 animate-ping" />
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_8px_#06b6d4] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Orbiting Ring 3 */}
      <div className="absolute w-[300px] h-[300px] border border-purple-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" style={{ transform: 'rotateX(-65deg) rotateY(45deg)' }}>
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-fuchsia-500 rounded-full shadow-[0_0_10px_#d946ef] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* 3D Holographic Anatomical Body Scan Image with Radial Mask */}
      <div 
        className="relative z-10 w-full max-w-[360px] aspect-[4/5] overflow-hidden flex items-center justify-center"
        style={{
          WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 100%)',
          maskImage: 'radial-gradient(circle at center, black 65%, transparent 100%)'
        }}
      >
        <img
          src={heroBodyImg}
          alt="Medora AI Glowing 3D Anatomical Core"
          className="w-full h-full object-cover filter brightness-110 contrast-105 hover:scale-[1.05] transition-transform duration-500"
          style={{ objectPosition: '28% center' }}
        />
      </div>

      {/* Floating diagnostic labels in SVG space */}
      <div className="absolute right-0 top-[26%] glass-panel rounded-lg py-1 px-2 border-cyan-400/20 text-[9px] font-mono text-cyan-300 flex items-center gap-1 shadow-md shadow-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>VASCULAR SCAN: OK</span>
      </div>

      <div className="absolute left-[3%] top-[45%] glass-panel rounded-lg py-1 px-2 border-purple-400/20 text-[9px] font-mono text-purple-300 flex items-center gap-1 shadow-md shadow-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
        <span>CELL METABOLISM: OPTIMIZED</span>
      </div>

      <div className="absolute right-[2%] top-[65%] glass-panel rounded-lg py-1 px-2 border-fuchsia-400/20 text-[9px] font-mono text-fuchsia-300 flex items-center gap-1 shadow-md shadow-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-ping" />
        <span>NEURAL GRAPH: SYNCED</span>
      </div>
    </div>
  );
};
