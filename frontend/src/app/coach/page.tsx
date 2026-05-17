'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { Send, MessageSquareCode, Sparkles, User, Brain, AlertCircle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICoachChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `### 🧠 Neural Coach System Activated

Greetings Operator. I am **Dr. Shaper**, your AI Productivity Advisor. 

I coordinate your cognitive habits, gamification level, and focus hours to optimize your neuroplasticity.

*What cognitive aspect or productivity bottleneck would you like to debug today?*`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/ai/coach/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn('API error, executing locally sandbox fallback answers');
      // Simulated Coach responses
      let reply = `### 🧬 Coach Signal Interrupted

Operating in offline sandbox. Here is a cognitive hack:
* **The physiological sigh**: Double inhale through nose, extended exhale through mouth. Reduces cortisol by 30% instantly, boosting focus.
* Play the **Memory Matrix** on the **Brain Games** portal to reinforce neural memory grids!`;
      
      const prompt = inputValue.toLowerCase();
      if (prompt.includes('focus') || prompt.includes('pomodoro') || prompt.includes('study')) {
        reply = `### 🧠 Focus Block Hacks (Sandbox)

To optimize study blocks, apply **Ultradian Rhythms**:
* Engage in **50-minute study blocks** followed by **10-minute mental pauses** (disconnect from screens).
* Try triggering our ambient audio oscillator waves (Rain/Ocean) inside the **Focus Mode** page!`;
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      <div className="absolute top-20 left-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
        
        {/* Header bar */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <MessageSquareCode className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg uppercase tracking-wider">AI Neural Advisor</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Dr. Shaper Unit // Active</p>
          </div>
        </div>

        {/* Message feed */}
        <GlassCard glowColor="purple" className="flex-1 overflow-y-auto p-6 space-y-4 mb-4 select-text">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={index} 
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                  isUser 
                    ? 'bg-purple-500/15 border-purple-500/35 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                    : 'bg-cyan-500/15 border-cyan-500/35 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>

                {/* Message Bubble Container */}
                <div className={`p-4 rounded-2xl border leading-relaxed text-sm ${
                  isUser 
                    ? 'bg-purple-500/5 border-purple-500/25 text-purple-100 rounded-tr-none' 
                    : 'bg-black/40 border-white/5 text-gray-300 rounded-tl-none font-light prose prose-invert'
                }`}>
                  {/* Parse basic markdown format headers and lists simply */}
                  {msg.content.split('\n').map((line, lIdx) => {
                    if (line.startsWith('###')) {
                      return <h3 key={lIdx} className="font-bold text-base text-cyan-400 mt-2 mb-1.5 uppercase tracking-wide">{line.replace('###', '')}</h3>;
                    }
                    if (line.startsWith('* **')) {
                      // Bullet line with bold
                      const raw = line.replace('* **', '').split('**');
                      return (
                        <div key={lIdx} className="flex gap-1.5 items-start text-xs my-1 pl-1">
                          <span className="text-purple-400 mt-1">•</span>
                          <span><strong>{raw[0]}</strong>{raw[1]}</span>
                        </div>
                      );
                    }
                    if (line.startsWith('*')) {
                      return (
                        <div key={lIdx} className="flex gap-1.5 items-start text-xs my-1 pl-1">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{line.replace('*', '')}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className="my-1 text-xs md:text-sm leading-normal">{line}</p>;
                  })}
                </div>

              </div>
            );
          })}
          
          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Brain className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-black/30 border border-white/5 p-3 rounded-2xl rounded-tl-none">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse font-mono flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Generating synapses...
                </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </GlassCard>

        {/* Input box form */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            placeholder="Type focus/streaks bottleneck advice requests..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl glass-input text-sm"
          />
          <GlowButton 
            type="submit" 
            variant="purple" 
            disabled={loading || !inputValue.trim()}
            className="px-4 py-3"
          >
            <Send className="w-4 h-4" />
          </GlowButton>
        </form>

      </div>
    </main>
  );
}
