import React from 'react';

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
  const getGlowStyle = () => {
    switch (glowColor) {
      case 'teal':
      case 'purple':
        return 'hover:shadow-[0_12px_35px_-5px_rgba(13,148,136,0.2)] hover:border-teal-300';
      case 'emerald':
      case 'blue':
        return 'hover:shadow-[0_12px_35px_-5px_rgba(5,150,105,0.2)] hover:border-emerald-300';
      case 'sky':
      case 'magenta':
        return 'hover:shadow-[0_12px_35px_-5px_rgba(14,165,233,0.2)] hover:border-sky-300';
      default:
        return 'hover:border-teal-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-white border border-teal-100/80 shadow-[0_2px_12px_rgba(13,148,136,0.06)] rounded-2xl p-6 transition-all duration-300 ${getGlowStyle()} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top teal accent line */}
      <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent pointer-events-none rounded-full" />
      {children}
    </div>
  );
};
