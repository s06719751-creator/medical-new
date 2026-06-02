import React, { useState } from 'react';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'teal' | 'emerald' | 'sky' | 'purple' | 'blue' | 'magenta' | 'none';
  onClick?: () => void;
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className = '',
  glowColor = 'teal',
  onClick
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getGlowColor = () => {
    switch (glowColor) {
      case 'teal': return 'rgba(13, 148, 136, 0.12)';
      case 'purple': return 'rgba(168, 85, 247, 0.12)';
      case 'emerald': return 'rgba(5, 150, 105, 0.12)';
      case 'blue': return 'rgba(59, 130, 246, 0.12)';
      case 'sky': return 'rgba(14, 165, 233, 0.12)';
      case 'magenta': return 'rgba(217, 70, 239, 0.12)';
      case 'none': return 'transparent';
      default: return 'rgba(13, 148, 136, 0.08)';
    }
  };

  const getBorderColorStyle = () => {
    switch (glowColor) {
      case 'teal':
      case 'purple':
        return 'hover:border-teal-300/80 hover:shadow-[0_15px_30px_-5px_rgba(13,148,136,0.12)]';
      case 'emerald':
      case 'blue':
        return 'hover:border-emerald-300/80 hover:shadow-[0_15px_30px_-5px_rgba(5,150,105,0.12)]';
      case 'sky':
      case 'magenta':
        return 'hover:border-sky-300/80 hover:shadow-[0_15px_30px_-5px_rgba(14,165,233,0.12)]';
      default:
        return 'hover:border-teal-200/80 hover:shadow-[0_15px_30px_-5px_rgba(13,148,136,0.08)]';
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-white border border-teal-100/70 shadow-[0_4px_20px_rgba(13,148,136,0.04)] rounded-[24px] p-6 transition-all duration-500 overflow-hidden ${getBorderColorStyle()} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
      {/* Top glowing accent line */}
      <div className="absolute top-0 left-12 right-12 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent pointer-events-none rounded-full z-10" />

      {/* Dynamic Follow-the-Cursor Glow Spot */}
      {isHovered && glowColor !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${getGlowColor()}, transparent 75%)`,
            zIndex: 0
          }}
        />
      )}

      {/* Card Content (Relative z-10 to stay on top of the hover glow) */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
