import React from 'react';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'magenta' | 'none';
  onClick?: () => void;
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className = '',
  glowColor = 'purple',
  onClick
}) => {
  const getGlowStyle = () => {
    switch (glowColor) {
      case 'purple':
        return 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)] hover:border-purple-500/40';
      case 'blue':
        return 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)] hover:border-cyan-400/40';
      case 'magenta':
        return 'hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.25)] hover:border-fuchsia-500/40';
      default:
        return 'hover:border-white/20';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel glass-card-hover rounded-2xl p-6 ${getGlowStyle()} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top glowing ambient gradient bar */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
