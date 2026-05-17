'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'cyan' | 'emerald' | 'none';
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  glowColor = 'none',
  onClick
}: GlassCardProps) {
  let glowClass = '';
  if (glowColor === 'purple') {
    glowClass = 'hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]';
  } else if (glowColor === 'cyan') {
    glowClass = 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]';
  } else if (glowColor === 'emerald') {
    glowClass = 'hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]';
  }

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 ${glowClass} ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
