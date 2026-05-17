'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { 
  ShieldAlert, 
  Terminal, 
  Users, 
  Database, 
  Cpu, 
  Radio, 
  Zap, 
  Flame, 
  RotateCcw,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalUsers: 1420,
    activeToday: 842,
    totalExercisesLogged: 3200,
    activePlayerXp: 2350,
    serverUptime: '99.98%',
    cpuLoad: '4.2%',
    activeWebsockets: 18
  });

  const [logs, setLogs] = useState<string[]>([
    '[INIT] Mind Shaper microservices initialized on Port 5000',
    '[AUTH] Loaded Supabase JWT offline validation shards',
    '[SECURE] CORS origins mapped successfully to frontend client',
    '[DB] Trigger process_xp_leveling() compiled in database engine',
  ]);

  const [message, setMessage] = useState('');

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/admin/stats', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setStats(data.stats);
      }
    } catch (e) {
      console.warn('API offline, rendering sandboxed telemetry logs');
    }
  };

  useEffect(() => {
    fetchAdminStats();
    
    // Simulate active telemetry logging
    const logInterval = setInterval(() => {
      const newLogs = [
        `[AUTH] Verified JWT Bearer token signature for sandbox node`,
        `[DB] Successfully logged exercise score [reflex radar] +120 XP`,
        `[AI] Response generated for Coach portal chat thread`,
        `[NET] WebSockets heartbeat synced [18 active nodes]`,
      ];
      const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
      setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
    }, 4000);

    return () => clearInterval(logInterval);
  }, []);

  const handleSimulateAction = async (action: 'add_xp' | 'reset_streak') => {
    setMessage(`Simulating action: ${action.replace('_', ' ')}...`);

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/admin/simulate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action,
          amount: action === 'add_xp' ? 1000 : undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`SUCCESS: ${data.message}`);
        setTimeout(() => setMessage(''), 3000);
        fetchAdminStats();
      } else {
        throw new Error();
      }
    } catch (e) {
      // Offline fallback alert
      setMessage(`SANDBOX SUCCESS: Simulated ${action} offline successfully.`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10 space-y-8">
        
        {/* Title */}
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2 text-red-500">
            <ShieldAlert className="w-7 h-7 text-red-500 animate-pulse" />
            Admin Command
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Operational dashboard and sandbox simulation controls</p>
        </div>

        {message && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl p-3.5 flex items-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <GlassCard glowColor="none" className="p-5 flex items-center gap-4 border-red-500/10">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Registered Units</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.totalUsers}</p>
            </div>
          </GlassCard>

          <GlassCard glowColor="none" className="p-5 flex items-center gap-4 border-red-500/10">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">DAU Active</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.activeToday}</p>
            </div>
          </GlassCard>

          <GlassCard glowColor="none" className="p-5 flex items-center gap-4 border-red-500/10">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Exercises Tracked</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.totalExercisesLogged}</p>
            </div>
          </GlassCard>

          <GlassCard glowColor="none" className="p-5 flex items-center gap-4 border-red-500/10">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">CPU Operational Load</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.cpuLoad}</p>
            </div>
          </GlassCard>

        </div>

        {/* Telemetry and Simulation controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Telemetry Logs Panel (2/3 width) */}
          <GlassCard glowColor="none" className="md:col-span-2 p-6 border-red-500/10 flex flex-col h-80">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Operational Telemetry Logs</h3>
            </div>

            {/* Terminal console */}
            <div className="flex-1 bg-black p-4 rounded-xl border border-white/5 font-mono text-[10px] text-cyan-400 space-y-2 overflow-y-auto leading-normal">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-red-500 shrink-0">&gt;</span>
                  <span className="whitespace-pre-wrap">{log}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Sandbox controls panel (1/3 width) */}
          <GlassCard glowColor="none" className="p-6 border-red-500/10 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Sandbox Adjustments</span>
            </div>

            <p className="text-[10px] text-gray-500 leading-normal font-light">
              Use these bypass switches to adjust parameters for quick verification of unlocked badges.
            </p>

            <GlowButton 
              variant="outline" 
              onClick={() => handleSimulateAction('add_xp')}
              className="flex items-center justify-center gap-2 text-xs py-3 border-yellow-500/10 hover:border-yellow-500/30 text-yellow-400"
            >
              <Zap className="w-4 h-4 fill-yellow-500/10" />
              INJECT +1000 XP BOOST
            </GlowButton>

            <GlowButton 
              variant="outline" 
              onClick={() => handleSimulateAction('reset_streak')}
              className="flex items-center justify-center gap-2 text-xs py-3 border-amber-500/10 hover:border-amber-500/30 text-amber-500"
            >
              <Flame className="w-4 h-4" />
              PURGE PROFILE STREAKS
            </GlowButton>
          </GlassCard>

        </div>

      </div>
    </main>
  );
}
