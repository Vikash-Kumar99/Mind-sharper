'use client';

import React, { useState } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { HelpCircle, Star, RotateCcw } from 'lucide-react';

interface TrickyPuzzleProps {
  onGameComplete: (score: number, xp: number) => void;
}

interface Question {
  id: number;
  questionText: string;
  hint: string;
  type: 'scale' | 'wordplay' | 'seedling';
}

export default function TrickyPuzzle({ onGameComplete }: TrickyPuzzleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [feedback, setFeedback] = useState('Think outside the box! Standard logic may deceive you.');

  const questions: Question[] = [
    {
      id: 1,
      questionText: 'Select the absolute largest object in the cosmic reality:',
      hint: 'Do not trust your visual optic scale. Trust real physical mass!',
      type: 'scale'
    },
    {
      id: 2,
      questionText: 'Find the exact "answer" to complete this formula: 5 + 4 = ?',
      hint: 'Focus strictly on the prompt phrasing and quotes.',
      type: 'wordplay'
    },
    {
      id: 3,
      questionText: 'Make this seedling flower grow by placing a source of light!',
      hint: 'Where is the light? Look around the user interface details.',
      type: 'seedling'
    }
  ];

  const handleChoice = (optionType: string) => {
    if (gameState !== 'playing') return;

    const currentQ = questions[currentStep];

    if (currentQ.type === 'scale') {
      if (optionType === 'sun') {
        setScore(prev => prev + 100);
        setFeedback('✔ Brilliant! Visually small here, but physically massive!');
        advanceQuestion();
      } else {
        setFeedback('❌ Incorrect. That only looks big visually!');
      }
    }

    if (currentQ.type === 'wordplay') {
      if (optionType === 'exact_word') {
        setScore(prev => prev + 100);
        setFeedback('✔ Phenomenal! You clicked the word "answer" in the question itself!');
        advanceQuestion();
      } else {
        setFeedback('❌ Incorrect. 9 is too simple! Read the instructions carefully.');
      }
    }
  };

  const handleSeedlingAction = (actionType: string) => {
    if (gameState !== 'playing') return;

    if (actionType === 'glowing_title') {
      setScore(prev => prev + 150); // Harder puzzle!
      setFeedback('✔ Master of lateral logic! You dragged the glowing header bulb to the flower!');
      handleEndGame(true);
    } else {
      setFeedback('❌ Seedling requires illumination. Fertilizer or standard water keeps it dark!');
    }
  };

  const advanceQuestion = () => {
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setFeedback('Next tricky challenge loaded! Retain flexible focus.');
    }, 2000);
  };

  const handleEndGame = (won: boolean) => {
    setGameState('gameover');
    const finalScore = score + (won ? 150 : 0);
    const earnedXp = Math.round(finalScore * 1.6);
    onGameComplete(finalScore, earnedXp);
  };

  const restartPuzzle = () => {
    setCurrentStep(0);
    setScore(0);
    setGameState('playing');
    setFeedback('Think outside the box! Standard logic may deceive you.');
  };

  return (
    <GlassCard glowColor="purple" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Tricky Lateral</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>{score} pts</span>
        </div>
      </div>

      <div className="text-center mb-6 h-12 px-4">
        <p className={`text-xs font-semibold tracking-wide uppercase ${
          feedback.includes('❌') ? 'text-red-400' :
          feedback.includes('✔') ? 'text-emerald-400 animate-pulse' : 'text-gray-300'
        }`}>
          {feedback}
        </p>
      </div>

      {gameState === 'playing' && (
        <div className="w-full px-4 text-center">
          {/* Question Text */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/20 mb-6 flex flex-col items-center justify-center min-h-[140px] relative">
            <span className="absolute top-2 left-2 text-[10px] font-mono text-purple-400 uppercase">Riddle {currentStep + 1} of 3</span>
            
            {/* The interactive glowing title word trick for seedling */}
            <p className="text-sm font-bold text-white leading-relaxed">
              {questions[currentStep].id === 2 ? (
                <>
                  Find the exact{' '}
                  <span 
                    onClick={() => handleChoice('exact_word')} 
                    className="text-cyan-400 underline cursor-pointer hover:text-cyan-300 font-black animate-pulse"
                  >
                    "answer"
                  </span>{' '}
                  to complete this formula: 5 + 4 = ?
                </>
              ) : questions[currentStep].id === 3 ? (
                <>
                  Make this seedling flower grow by placing a source of{' '}
                  <span 
                    onClick={() => handleSeedlingAction('glowing_title')} 
                    className="text-yellow-400 font-black cursor-pointer underline shadow-yellow-500 animate-bounce"
                  >
                    LIGHT
                  </span>{' '}
                  bulb above it!
                </>
              ) : (
                questions[currentStep].questionText
              )}
            </p>
            <p className="text-[10px] text-gray-500 mt-4 italic">{questions[currentStep].hint}</p>
          </div>

          {/* Scale Riddle options */}
          {questions[currentStep].type === 'scale' && (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleChoice('football')}
                className="p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center cursor-pointer"
              >
                <span className="text-4xl mb-2 animate-pulse">⚽</span>
                <span className="text-[10px] text-gray-400 uppercase font-black">Giant Football</span>
              </button>
              <button
                onClick={() => handleChoice('elephant')}
                className="p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center cursor-pointer"
              >
                <span className="text-2xl mb-2">🐘</span>
                <span className="text-[10px] text-gray-400 uppercase font-black">Medium Elephant</span>
              </button>
              <button
                onClick={() => handleChoice('sun')}
                className="p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-center cursor-pointer"
              >
                <span className="text-[8px] mb-2 animate-spin duration-1000">☀️</span>
                <span className="text-[10px] text-gray-400 uppercase font-black">Tiny Sun</span>
              </button>
            </div>
          )}

          {/* Wordplay Riddle options */}
          {questions[currentStep].type === 'wordplay' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChoice('num_nine')}
                className="py-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl font-mono font-bold text-lg cursor-pointer"
              >
                9
              </button>
              <button
                onClick={() => handleChoice('num_eight')}
                className="py-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl font-mono font-bold text-lg cursor-pointer"
              >
                8
              </button>
            </div>
          )}

          {/* Seedling Riddle options */}
          {questions[currentStep].type === 'seedling' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-[#090d16] border border-green-500/20 rounded-2xl flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <span className="text-4xl animate-pulse">🌱</span>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => handleSeedlingAction('water')}
                  className="py-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl text-[10px] uppercase font-bold text-gray-400 cursor-pointer"
                >
                  🌧 Water Seedling
                </button>
                <button
                  onClick={() => handleSeedlingAction('fertilizer')}
                  className="py-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl text-[10px] uppercase font-bold text-gray-400 cursor-pointer"
                >
                  💩 Add Fertilizer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-2xl animate-bounce">🏆</span>
          <p className="text-sm font-bold text-emerald-400">Lateral Riddle Clean Sweep!</p>
          <p className="text-xs text-gray-400">Final Score: {score} pts. Earned +{Math.round(score * 1.6)} XP</p>
          <GlowButton variant="outline" className="flex items-center gap-2" onClick={restartPuzzle}>
            <RotateCcw className="w-4 h-4" />
            Re-engage Riddles
          </GlowButton>
        </div>
      )}
    </GlassCard>
  );
}
