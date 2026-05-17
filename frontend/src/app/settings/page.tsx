'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { 
  Settings, 
  User, 
  Volume2, 
  Key, 
  Sparkles, 
  Trash2,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [username, setUsername] = useState('neon_shaper_404');
  const [fullName, setFullName] = useState('Neural Wanderer');
  const [neonAccent, setNeonAccent] = useState('purple');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  const [message, setMessage] = useState('');

  // Load from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem('user-openai-key') || '';
    setOpenaiKey(savedKey);

    const savedAccent = localStorage.getItem('neon-accent') || 'purple';
    setNeonAccent(savedAccent);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save API key
    if (openaiKey) {
      localStorage.setItem('user-openai-key', openaiKey);
    } else {
      localStorage.removeItem('user-openai-key');
    }

    // Save Accent
    localStorage.setItem('neon-accent', neonAccent);

    setMessage('Preferences updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetData = () => {
    if (confirm('Are you absolutely sure you want to clear your local memory? This will reset your sandbox stats.')) {
      localStorage.clear();
      setMessage('Sandbox cached datasets reset successfully.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 space-y-8">
        
        {/* Title */}
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
            <Settings className="w-7 h-7 text-cyan-400 animate-pulse" />
            Core Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Configure visual preferences and secure keys</p>
        </div>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-3.5 flex items-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* User profile details settings */}
          <GlassCard glowColor="purple">
            <h3 className="font-bold text-sm uppercase tracking-wider text-purple-400 mb-6 flex items-center gap-2">
              <User className="w-4 h-4" />
              Operator Coordinates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">User Handle</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Operator Real Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>
          </GlassCard>

          {/* Premium UI Accent preferences settings */}
          <GlassCard glowColor="cyan">
            <h3 className="font-bold text-sm uppercase tracking-wider text-cyan-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Cyber-Styling Accents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Neon Accent Glow</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setNeonAccent('purple')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                      neonAccent === 'purple' 
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                        : 'bg-white/2 border-white/5 text-gray-500'
                    }`}
                  >
                    Purple Nebula
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeonAccent('cyan')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                      neonAccent === 'cyan' 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                        : 'bg-white/2 border-white/5 text-gray-500'
                    }`}
                  >
                    Cyan Radar
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border border-white/5 bg-black/20 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs uppercase font-bold tracking-wider">Haptic Sound waves</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 bg-white/10 rounded cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* OpenAI Private key configurations settings */}
          <GlassCard glowColor="none">
            <h3 className="font-bold text-sm uppercase tracking-wider text-yellow-500 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Private Credentials Key (Optional)
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6 font-light">
              Bypass local server limits by directly saving your OpenAI Private Key in secure local browser cache. Mind Shaper never uploads this key to external networks.
            </p>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl glass-input text-sm font-mono text-yellow-300"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </GlassCard>

          {/* Controls button actions row */}
          <div className="flex gap-4">
            <GlowButton type="submit" variant="cyan" className="flex-1 py-3 text-xs font-bold uppercase tracking-widest">
              Save Coordinates
            </GlowButton>
            <GlowButton 
              type="button" 
              variant="outline" 
              onClick={handleResetData}
              className="text-red-400 hover:text-red-300 border-red-500/10 hover:border-red-500/25 px-5 flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Purge Memory Cache
            </GlowButton>
          </div>

        </form>

      </div>
    </main>
  );
}
