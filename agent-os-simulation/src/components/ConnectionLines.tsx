"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionLinesProps {
  subAgents: any[];
  phase: string;
  activeSubAgent: string | null;
  radius: number;
}

export default function ConnectionLines({ subAgents, phase, activeSubAgent, radius }: ConnectionLinesProps) {
  
  if (phase === 'Idle' || phase === 'Prompting') return null;
  
  const angles = [195, 270, 345];

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg className="w-full h-full">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Faint Orbital Ring */}
        <circle 
          cx="50%" cy="50%" r={radius} 
          fill="none" 
          stroke="rgba(255,255,255,0.02)" 
          strokeWidth="1" 
          strokeDasharray="4 8"
        />

        {subAgents.map((sa, index) => {
          const angle = angles[index];
          const rad = (angle - 90) * (Math.PI / 180);
          
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          const isActive = activeSubAgent === sa.id;

          return (
            <g key={sa.id}>
              <line 
                x1="50%" y1="50%" 
                x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              {phase !== 'Idle' && (
                <motion.line 
                  x1="50%" y1="50%" 
                  x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`}
                  stroke={isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)"}
                  strokeWidth={isActive ? "2" : "1"}
                  initial={{ strokeDasharray: "0 1000" }}
                  animate={{ strokeDasharray: "1000 1000" }}
                  transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
