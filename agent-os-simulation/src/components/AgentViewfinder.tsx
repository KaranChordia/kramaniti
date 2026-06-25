"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, ShieldAlert, Zap, Network } from 'lucide-react';
import { SubAgentState } from '../hooks/useSimulation';

interface AgentViewfinderProps {
  phase: string;
  activeSubAgent: string | null;
  subAgents: SubAgentState[];
}

// Map agent IDs to specific theme colors to match their pills
const agentColors: Record<string, string> = {
  'sa-1': '#4ADE80', // Green
  'sa-2': '#38BDF8', // Blue
  'sa-3': '#C084FC', // Purple
};

export default function AgentViewfinder({ phase, activeSubAgent, subAgents }: AgentViewfinderProps) {
  const isVisible = (phase === 'Delegation' || phase === 'Execution');
  
  const agent = subAgents.find(sa => sa.id === activeSubAgent);
  const colorHex = agent ? agentColors[agent.id] : '#fff';
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [agent?.logHistory]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -60, filter: 'blur(15px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -60, filter: 'blur(15px)' }}
          transition={{ duration: 0.9, type: "spring", stiffness: 220, damping: 28 }}
          className="absolute left-10 top-1/2 transform -translate-y-1/2 w-[360px] h-[500px] z-40 flex flex-col"
        >
          {/* 1px Gradient Border Shell */}
          <div className="relative w-full h-full rounded-[1.5rem] p-[1px] bg-gradient-to-b from-[rgba(255,255,255,0.25)] via-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Deep Glass Core */}
            <div className="w-full h-full rounded-[calc(1.5rem-1px)] bg-[rgba(15,17,23,0.8)] backdrop-blur-3xl flex flex-col relative overflow-hidden">
              
              {/* Internal Accent Glow */}
              <motion.div 
                className="absolute -top-32 -left-32 w-64 h-64 blur-[80px] rounded-full pointer-events-none"
                animate={{ backgroundColor: `${colorHex}15` }}
                transition={{ duration: 1 }}
              />

              {/* Header */}
              <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-transparent flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <Network size={16} className="text-zinc-400" />
                  <h3 className="text-[12px] font-semibold tracking-[0.2em] uppercase text-zinc-300">
                    Viewfinder
                  </h3>
                </div>
                {agent && (
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.4)]">
                    <Activity size={12} className="animate-pulse" style={{ color: colorHex }} />
                    <span className="text-[9px] uppercase tracking-widest font-mono" style={{ color: colorHex }}>Sync</span>
                  </div>
                )}
              </div>

              {/* Agent Context Area */}
              <div className="px-6 py-6 flex flex-col relative z-10 min-h-[140px]">
                {agent ? (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={agent.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Active Node</span>
                        <div className="flex items-center gap-3">
                          <h4 className="text-2xl font-bold text-white tracking-tight leading-none">{agent.name}</h4>
                          <Zap size={16} style={{ color: colorHex }} className="animate-pulse" />
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] w-fit mt-3 shadow-inner">
                          <ShieldAlert size={12} className="text-zinc-400" />
                          <span className="text-[10px] text-zinc-300 font-mono uppercase tracking-wider">{agent.role}</span>
                        </div>
                      </div>

                      {/* Thin Progress Bar */}
                      <div className="w-full h-[3px] bg-[rgba(255,255,255,0.06)] overflow-hidden mt-6 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]">
                        <motion.div 
                          className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                          style={{ backgroundColor: colorHex, color: colorHex }}
                          initial={{ width: 0 }}
                          animate={{ width: `${agent.progress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col gap-2 py-4 h-full justify-center">
                    <span className="text-sm text-zinc-500 font-medium">Awaiting delegation...</span>
                  </div>
                )}
              </div>

              {/* Terminal Log Output */}
              <div className="flex-1 flex flex-col bg-[#0A0C10] border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />
                
                <div className="flex items-center gap-2 px-5 py-3 border-b border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)] relative z-10">
                  <Terminal size={12} className="text-zinc-600" />
                  <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-[0.2em]">StdOut</span>
                </div>
                
                {/* Scrolling Logs with Vertical Fade Mask */}
                <div 
                  className="flex-1 overflow-hidden relative"
                  style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
                >
                  <div 
                    ref={scrollRef}
                    className="absolute inset-0 overflow-y-auto px-5 py-4 scrollbar-hide flex flex-col gap-3"
                  >
                    {agent?.logHistory.map((log, idx) => {
                      const isLatest = idx === agent.logHistory.length - 1;
                      return (
                        <motion.div 
                          key={`${agent.id}-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: isLatest ? 1 : 0.6, x: 0 }}
                          className="flex gap-4 text-[12px] font-mono leading-relaxed"
                        >
                          <span className="text-zinc-600 shrink-0">{(new Date()).toISOString().substring(11, 19)}</span>
                          <span className={isLatest ? "text-zinc-200" : "text-zinc-400"}>
                            {log}
                          </span>
                        </motion.div>
                      );
                    })}
                    {agent && agent.status !== 'Complete' && (
                      <div className="flex gap-4 text-[12px] font-mono leading-relaxed mt-2 opacity-80">
                        <span className="text-zinc-600 shrink-0">{(new Date()).toISOString().substring(11, 19)}</span>
                        <span className="text-white flex items-center">
                          <span className="w-2 h-[14px] bg-white animate-pulse shadow-[0_0_8px_white]" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
