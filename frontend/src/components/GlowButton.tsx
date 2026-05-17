'use client';

import React from 'react';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'purple' | 'cyan' | 'emerald' | 'outline';
  glow?: boolean;
  className?: string;
}

export default function GlowButton({
  children,
  variant = 'purple',
  glow = true,
  className = '',
  ...props
}: GlowButtonProps) {
  let styleClasses = '';
  
  if (variant === 'purple') {
    styleClasses = 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-transparent';
    if (glow) styleClasses += ' shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]';
  } else if (variant === 'cyan') {
    styleClasses = 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-transparent';
    if (glow) styleClasses += ' shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]';
  } else if (variant === 'emerald') {
    styleClasses = 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-transparent';
    if (glow) styleClasses += ' shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]';
  } else if (variant === 'outline') {
    styleClasses = 'bg-white/5 border border-white/10 hover:bg-white/10 text-white';
  }

  return (
    <button
      className={`relative inline-flex items-center justify-center font-medium rounded-xl px-5 py-2.5 text-sm transition-all duration-300 transform active:scale-95 cursor-pointer border ${styleClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
