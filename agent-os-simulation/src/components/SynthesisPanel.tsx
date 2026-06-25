"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, LayoutTemplate, CheckCircle2, Sparkles, Box, Fingerprint, LucideIcon, Shield, Server, FileText, Activity } from 'lucide-react';
import { SimulationTemplate } from '../hooks/useSimulation';

interface SynthesisPanelProps {
  phase: string;
  activeTemplate: SimulationTemplate | null;
}

const getIconForIndex = (index: number): LucideIcon => {
  const icons = [Database, LayoutTemplate, Box, Shield, Server, FileText];
  return icons[index % icons.length];
};

const agentColors = ['#4ADE80', '#38BDF8', '#C084FC'];

export default function SynthesisPanel({ phase, activeTemplate }: SynthesisPanelProps) {
  const [currentColorIdx, setCurrentColorIdx] = useState(0);

  useEffect(() => {
    if (phase === 'Synthesis' || phase === 'Complete') {
      const interval = setInterval(() => {
        setCurrentColorIdx((prev) => (prev + 1) % agentColors.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  if (phase !== 'Synthesis' && phase !== 'Complete') return null;
  if (!activeTemplate) return null;

  const isComplete = phase === 'Complete';
  const activeColor = agentColors[currentColorIdx];

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-[800px]"
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 40, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* 1px Gradient Border Wrapper mapping to active color */}
      <motion.div 
        className="relative w-full rounded-[1.5rem] p-[1px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
        animate={{
          background: `linear-gradient(180deg, ${activeColor}40, rgba(255,255,255,0.02))`
        }}
        transition={{ duration: 2, ease: "linear" }}
      >
        
        {/* Deep Glass Core */}
        <div className="w-full h-full rounded-[calc(1.5rem-1px)] bg-[rgba(10,12,16,0.85)] backdrop-blur-3xl flex flex-col relative overflow-hidden">
          
          {/* Internal Ambient Glows synced to color */}
          <motion.div 
            className="absolute -top-32 -left-32 w-96 h-96 blur-[100px] rounded-full pointer-events-none"
            animate={{ backgroundColor: `${activeColor}15` }}
            transition={{ duration: 2 }}
          />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] px-8 py-6 relative z-10 bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-transparent">
            <div className="flex items-center gap-5">
              <motion.div 
                className="relative flex items-center justify-center w-12 h-12 rounded-full border border-[rgba(255,255,255,0.08)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                animate={{ backgroundColor: `${activeColor}10` }}
                transition={{ duration: 2 }}
              >
                {isComplete ? (
                  <CheckCircle2 color={activeColor} size={22} strokeWidth={2.5} />
                ) : (
                  <Sparkles className="text-zinc-400 animate-pulse" size={20} />
                )}
              </motion.div>
              <div className="flex flex-col">
                <h2 className="text-[24px] font-bold tracking-tight text-white leading-tight">
                  {isComplete ? activeTemplate.title + ' Complete' : 'Synthesizing Output...'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Activity size={12} className="animate-pulse" style={{ color: activeColor }} />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: activeColor }}>
                    {isComplete ? 'All nodes synchronized' : 'Awaiting final checksums'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]">
              <Fingerprint size={14} className="text-zinc-500" />
              <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">Auth: Valid</span>
            </div>
          </div>

          {/* Terminal / Metric Output Area */}
          <div className="flex-1 flex flex-col bg-[#0A0C10] relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />
            
            <div className="grid grid-cols-3 gap-6 relative z-10">
              {activeTemplate.synthesisData.metrics.map((metric, idx) => {
                const Icon = getIconForIndex(idx);
                const colorHex = agentColors[idx % agentColors.length];

                return (
                  <motion.div 
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + (idx * 0.2) }}
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.02)" }}
                    className="bg-[rgba(0,0,0,0.4)] rounded-[1rem] p-6 border border-[rgba(255,255,255,0.04)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.3)] cursor-default transition-all duration-300 flex flex-col relative overflow-hidden group"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${colorHex}05)` }} />

                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] relative" style={{ backgroundColor: `${colorHex}10`, borderColor: `${colorHex}30` }}>
                      <Icon style={{ color: colorHex }} size={16} />
                    </div>
                    
                    <h3 className="text-[14px] font-bold text-zinc-100 mb-2 tracking-tight uppercase">{metric.label}</h3>
                    
                    <div className="w-full h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-transparent my-3" />
                    
                    <p className="text-[12px] text-zinc-400 leading-relaxed font-mono">
                      <strong className="text-white bg-[rgba(255,255,255,0.05)] px-1 py-0.5 rounded mr-1">{metric.value}</strong>
                      <br/>
                      <span className="mt-2 block opacity-70">{metric.desc}</span>
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulated Shell Prompt at bottom */}
            {isComplete && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                className="mt-8 flex items-center gap-3 text-[11px] font-mono text-zinc-500"
              >
                <span className="text-[#4ADE80]">root@agent-os</span>
                <span>~</span>
                <span>$ task_synthesis --status complete</span>
                <span className="w-2 h-3 bg-zinc-400 animate-pulse shadow-[0_0_8px_white]" />
              </motion.div>
            )}

          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
