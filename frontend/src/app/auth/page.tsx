'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { supabase } from '../../utils/supabase';
import { Brain, Mail, Lock, Sparkles, UserPlus, Info } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Check if standard keys are mock placeholders
  const isMockEnv = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-supabase');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage({ text: 'Please fill in all inputs.', isError: true });
      setLoading(false);
      return;
    }

    try {
      if (isMockEnv) {
        // Developer Mock Sandbox bypass
        setMessage({ text: 'Accessing local development sandbox. Redirecting...', isError: false });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
        return;
      }

      // Direct Supabase Client Operations
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || 'Mind Voyager'
            }
          }
        });

        if (error) throw error;
        setMessage({ text: 'Sign up successful! Please check your email inbox to confirm registration.', isError: false });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        setMessage({ text: 'Authentication successful! Redirecting...', isError: false });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setMessage({ text: err.message || 'An error occurred during authentication.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxBypass = () => {
    setMessage({ text: 'Bypassing credentials using development Sandbox. Redirecting...', isError: false });
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative cyber-grid text-white">
      
      {/* Glow Rings */}
      <div className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-3">
            <Brain className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-center uppercase">MIND SHAPER SECURE GATE</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Authorize terminal access credentials</p>
        </div>

        <GlassCard glowColor={isSignUp ? 'cyan' : 'purple'} className="p-8">
          
          <div className="flex gap-4 border-b border-white/10 pb-4 mb-6">
            <button 
              onClick={() => { setIsSignUp(false); setMessage(null); }}
              className={`flex-1 pb-2 font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer ${!isSignUp ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Access Gate
            </button>
            <button 
              onClick={() => { setIsSignUp(true); setMessage(null); }}
              className={`flex-1 pb-2 font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer ${isSignUp ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Register Unit
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">User Operator Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="E.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">E-mail Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="operator@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Passphrase Key</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {message && (
              <div className={`p-3.5 rounded-xl text-xs flex gap-2 items-start border ${
                message.isError 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{message.text}</span>
              </div>
            )}

            <GlowButton 
              type="submit" 
              variant={isSignUp ? 'cyan' : 'purple'} 
              className="w-full py-3 mt-4 text-xs font-bold uppercase tracking-widest"
              disabled={loading}
            >
              {loading ? 'Processing Crypt-Key...' : isSignUp ? 'Initiate Register Shaper' : 'De-crypt Access Session'}
            </GlowButton>
          </form>

          {/* Sandbox Notice & Bypass Trigger */}
          {isMockEnv && (
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <div className="bg-purple-950/20 border border-purple-500/15 rounded-xl p-3 mb-4 text-left">
                <p className="text-[11px] text-purple-300 leading-normal font-light">
                  <strong>💡 Developer Sandbox Active:</strong> No active database connection detected. You can input any random credentials above or click below to bypass directly.
                </p>
              </div>
              <button 
                onClick={handleSandboxBypass}
                className="text-xs font-bold uppercase text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Bypass via Sandbox Pass
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
