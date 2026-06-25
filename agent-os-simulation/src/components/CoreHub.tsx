"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Check } from 'lucide-react';

interface CoreHubProps {
  phase: string;
}

export default function CoreHub({ phase }: CoreHubProps) {
  const isIdle = phase === 'Idle' || phase === 'Prompting';
  const isWorking = phase === 'Thinking' || phase === 'Delegation' || phase === 'Execution' || phase === 'Synthesis';
  const isComplete = phase === 'Complete';

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      
      {/* Active Sonar Energy Pulses when working */}
      {isWorking && (
        <>
          <motion.div 
            className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.1)] z-0"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.05)] z-0"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.25 }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.02)] blur-xl z-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </>
      )}

      {/* The Central Neumorphic Dial */}
      <motion.div 
        layout
        className="v4-core relative flex items-center justify-center w-32 h-32 z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: (phase === 'Synthesis' || phase === 'Complete') ? -180 : (isIdle ? [-5, 5, -5] : 0)
        }}
        transition={{ 
          type: "spring", stiffness: 200, damping: 20,
          y: (phase === 'Synthesis' || phase === 'Complete') 
            ? { type: "spring", stiffness: 100, damping: 20 }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        
        {/* Inner rotating ring */}
        <motion.div 
          className="absolute inset-2 rounded-full border border-[rgba(255,255,255,0.05)] border-t-[rgba(255,255,255,0.2)]"
          animate={{ rotate: isWorking ? 360 : 0 }}
          transition={{ duration: isWorking ? 3 : 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Icon */}
        <motion.div
          animate={{ scale: isWorking ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(0,0,0,0.4)] shadow-inner backdrop-blur-sm"
        >
          {isComplete ? (
             <Check size={28} className="text-[#3AAB64]" strokeWidth={2.5} />
          ) : (
             <Cpu size={28} className={isWorking ? "text-white" : "text-[var(--color-muted)]"} strokeWidth={1.5} />
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
