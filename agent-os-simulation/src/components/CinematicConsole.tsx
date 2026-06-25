"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface CinematicConsoleProps {
  phase: string;
  promptText: string;
}

export default function CinematicConsole({ phase, promptText }: CinematicConsoleProps) {
  return (
    <div className="absolute bottom-12 w-full flex justify-center z-50">
      <AnimatePresence mode="wait">
        
        {phase === 'Prompting' && (
          <motion.div 
            key="prompt"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-[650px] rounded-full p-[1px] bg-gradient-to-r from-[rgba(255,255,255,0.2)] via-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="w-full h-full rounded-full bg-[rgba(15,17,23,0.85)] backdrop-blur-2xl px-8 py-5 flex items-center gap-5">
              <Terminal size={20} className="text-zinc-500 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <p className="text-[16px] bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400 font-medium truncate w-full tracking-wide">
                  {promptText}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_12px_white] shrink-0" />
            </div>
          </motion.div>
        )}

        {(phase === 'Thinking' || phase === 'Delegation' || phase === 'Execution') && (
          <motion.div 
            key="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 px-6 py-2 rounded-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)] backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-muted)]">
              System Active &middot; {phase}
            </span>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
