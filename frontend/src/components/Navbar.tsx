'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain, 
  LayoutDashboard, 
  Gamepad2, 
  Timer, 
  CheckSquare, 
  BarChart3, 
  MessageSquareCode, 
  User, 
  Settings, 
  ShieldAlert, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exclude navbar from Landing Page and Auth Page to keep them immersive,
  // or render a streamlined version. Rendering globally adds excellent navigation!
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Brain Games', path: '/brain', icon: Gamepad2 },
    { name: 'Focus Station', path: '/focus', icon: Timer },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Coach', path: '/coach', icon: MessageSquareCode },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Admin', path: '/admin', icon: ShieldAlert },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-wide group-hover:text-purple-400 transition-colors">
            MIND SHAPER
          </span>
        </Link>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-300 ${
                  isActive 
                    ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* PROFILE/AUTH BUTTON */}
        <div className="hidden lg:flex items-center gap-2">
          <Link 
            href="/auth" 
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-2 border border-white/5 hover:border-white/20 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-400" />
            Auth Portal
          </Link>
        </div>

        {/* MOBILE MENU TOGGLER */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE NAV MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          <Link 
            href="/auth"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 border border-white/5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 mt-2"
          >
            <LogOut className="w-4 h-4" />
            Auth Portal
          </Link>
        </div>
      )}
    </nav>
  );
}
