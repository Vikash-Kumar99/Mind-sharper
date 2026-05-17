'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Timer, 
  CheckCircle2, 
  Smile,
  Activity,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>({
    totalFocusHours: 8.5,
    averageGameScore: 85,
    habitCompletionRate: 74,
    averageMoodScore: 4.2
  });

  // 1. Line Chart Data: Memory Matrix & Reflex scores over the week
  const cognitiveProgressData = [
    { name: 'Mon', score: 620 },
    { name: 'Tue', score: 710 },
    { name: 'Wed', score: 680 },
    { name: 'Thu', score: 820 },
    { name: 'Fri', score: 790 },
    { name: 'Sat', score: 940 },
    { name: 'Sun', score: 1020 },
  ];

  // 2. Bar Chart Data: Pomodoro minutes focused
  const dailyFocusData = [
    { day: 'Mon', minutes: 50 },
    { day: 'Tue', minutes: 75 },
    { day: 'Wed', minutes: 25 },
    { day: 'Thu', minutes: 100 },
    { day: 'Fri', minutes: 50 },
    { day: 'Sat', minutes: 120 },
    { day: 'Sun', minutes: 90 },
  ];

  // 3. Pie Chart Data: Skills distribution ratios
  const skillCategoryData = [
    { name: 'Memory', value: 40, color: '#a855f7' },  // Purple
    { name: 'Reflexes', value: 25, color: '#10b981' }, // Emerald
    { name: 'Focus', value: 35, color: '#06b6d4' },    // Cyan
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('sb-access-token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Fetch logs
        const exercisesRes = await fetch('http://localhost:5000/api/exercises', { headers }).catch(() => null);
        if (exercisesRes && exercisesRes.ok) {
          const res = await exercisesRes.json();
          if (res.success && res.scores.length > 0) {
            const avg = Math.round(res.scores.reduce((acc: number, curr: any) => acc + curr.score, 0) / res.scores.length);
            setStats((prev: any) => ({ ...prev, averageGameScore: avg }));
          }
        }
      } catch (e) {
        console.warn('Analytics API error, running in sandboxed mock mode.');
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 space-y-8">
        
        {/* Title */}
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-purple-400" />
            Neural Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Visual diagnostic charts of your cognitive expansion</p>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <GlassCard glowColor="purple" className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Focus Time</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.totalFocusHours} hrs</p>
            </div>
          </GlassCard>

          <GlassCard glowColor="cyan" className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Avg Game Accuracy</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.averageGameScore} pts</p>
            </div>
          </GlassCard>

          <GlassCard glowColor="emerald" className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Habit Streak Rate</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.habitCompletionRate}%</p>
            </div>
          </GlassCard>

          <GlassCard glowColor="none" className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Mood Correlation</p>
              <p className="text-xl font-black text-white mt-1.5 leading-none">{stats.averageMoodScore} / 5</p>
            </div>
          </GlassCard>

        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart 1: Line Chart Cognitive Trends (2/3 width) */}
          <GlassCard glowColor="purple" className="lg:col-span-2 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Cognitive Capacity Trend</h3>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cognitiveProgressData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1f2937', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#a855f7" 
                    strokeWidth={3} 
                    dot={{ fill: '#a855f7', stroke: '#030712', strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 2: Skills category Pie Chart (1/3 width) */}
          <GlassCard glowColor="none" className="p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Skill Mapping Ratio</h3>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1f2937', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Pie
                    data={skillCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {skillCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Brain text */}
              <div className="absolute text-center select-none">
                <Brain className="w-5 h-5 text-purple-400 mx-auto" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">Ratios</span>
              </div>
            </div>

            {/* Custom Legends list */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              {skillCategoryData.map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{cat.name}</span>
                  <span style={{ color: cat.color }} className="text-sm font-black mt-1 font-mono">{cat.value}%</span>
                </div>
              ))}
            </div>

          </GlassCard>

          {/* Chart 3: Focus Duration Bar Chart (Full bottom row) */}
          <GlassCard glowColor="cyan" className="lg:col-span-3 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Weekly Focus Minutes Map</h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyFocusData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1f2937', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="#06b6d4" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

        </div>

      </div>
    </main>
  );
}
