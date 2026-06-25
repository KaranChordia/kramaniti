"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface OrbitalAgentProps {
  name: string;
  role: string;
  status: string;
  progress: number;
  currentLog: string;
  isSpeaking: boolean;
  colorClass: string;
  angle: number;
  radius: number;
  delay: number;
}

export default function OrbitalAgent({ 
  name, role, status, progress, currentLog, 
  isSpeaking, colorClass, 
  angle, radius, delay 
}: OrbitalAgentProps) {
  
  const rad = (angle - 90) * (Math.PI / 180);
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  const isComplete = status === 'Complete';
  const isActive = status === 'Working' || isSpeaking;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{ 
        x: x - 160,
        y: y - 40,
        scale: isActive ? 1.05 : 1, 
        opacity: 1 
      }}
      exit={{ x: 0, y: 0, scale: 0, opacity: 0, filter: 'blur(5px)' }}
      transition={{ duration: 1, delay: delay, type: "spring", stiffness: 200, damping: 20 }}
    >
      <div 
        className={`v4-pill ${colorClass} relative flex flex-col justify-between overflow-hidden px-6 py-4 w-[320px] h-[80px] ${
          isSpeaking ? 'ring-1 ring-current shadow-[0_0_40px_currentColor]' : ''
        }`}
      >
        {/* Dynamic Glass Glare Sweep */}
        <motion.div 
          className="absolute top-0 left-[-150%] w-[100%] h-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent skew-x-[-30deg] z-0"
          animate={{ left: ['-150%', '250%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 + delay }}
        />

        <motion.div 
          className="absolute bottom-0 left-0 top-0 bg-current opacity-[0.08] z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        <div className="flex items-center gap-4 z-10 w-full h-full">
          <div className="flex items-center gap-3 min-w-[100px]">
            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${isComplete ? 'bg-current' : isActive ? 'bg-current animate-pulse' : 'bg-current opacity-30'}`} />
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-[14px] leading-tight tracking-tight text-white">{name}</span>
              <span className="text-[9px] uppercase font-bold tracking-[0.15em] opacity-60 mt-0.5 text-white">
                {role}
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center border-l border-white border-opacity-10 pl-4 h-full">
            <p className="text-[10px] font-medium leading-snug opacity-80 line-clamp-2 text-white">
               {status === 'Idle' ? 'Standing by...' : currentLog}
            </p>
          </div>

          <div className="flex items-center justify-end min-w-[40px]">
            <span className="text-[16px] font-semibold tracking-tighter text-white">
              {Math.round(progress)}<span className="text-[10px] opacity-60 ml-0.5">%</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
