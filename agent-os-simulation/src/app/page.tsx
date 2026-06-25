"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Database, Shield, Server, FileText, Hexagon } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import { VoiceManager } from '../lib/VoiceManager';

import CoreHub from '../components/CoreHub';
import OrbitalAgent from '../components/OrbitalAgent';
import ConnectionLines from '../components/ConnectionLines';
import CinematicConsole from '../components/CinematicConsole';

import SynthesisPanel from '../components/SynthesisPanel';
import AgentViewfinder from '../components/AgentViewfinder';
import { TEMPLATES } from '../hooks/useSimulation';

export default function Home() {
  const { phase, subAgents, startSimulation, activeTemplate, activeSubAgent } = useSimulation();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    VoiceManager.init();
  }, []);

  const handleStart = (templateId: string) => {
    setHasStarted(true);
    startSimulation(templateId);
  };

  const radius = 240; 
  const orbitalAngles = [195, 270, 345]; 
  const colors = ['pill-green', 'pill-blue', 'pill-purple'];

  return (
    <div className="canvas">
      
      {/* Dark V4 Start Overlay: Template Selector */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(15,17,23,0.9)] backdrop-blur-xl"
          >
            <div className="flex flex-col items-center mb-12">
              <Hexagon className="text-zinc-500 mb-4" size={40} />
              <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Select Simulation Task</h1>
              <p className="text-sm text-zinc-400 font-mono tracking-widest uppercase">Agent OS v5 Kernel</p>
            </div>

            <div className="grid grid-cols-5 gap-4 max-w-[1200px] w-full px-8">
              {TEMPLATES.map((template, idx) => (
                <motion.button
                  key={template.id}
                  onClick={() => handleStart(template.id)}
                  whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-start text-left p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6 group-hover:bg-[#4ADE80] group-hover:text-black transition-colors duration-300">
                    <Play size={16} className="text-zinc-300 group-hover:text-black" fill="currentColor" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight mb-2 leading-tight">
                    {template.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                    {template.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* V4 UI Assembly */}
      {hasStarted && (
        <>
          <AgentViewfinder 
            phase={phase} 
            activeSubAgent={activeSubAgent} 
            subAgents={subAgents} 
          />

          <AnimatePresence>
            {(phase === 'Delegation' || phase === 'Execution') && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0, filter: 'blur(5px)' }} 
                transition={{ duration: 1 }}
              >
                <ConnectionLines 
                  subAgents={subAgents} 
                  phase={phase} 
                  activeSubAgent={activeSubAgent} 
                  radius={radius} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <CoreHub phase={phase} />

          <AnimatePresence>
            {(phase === 'Delegation' || phase === 'Execution') && (
              <>
                {subAgents.map((sa, index) => (
                  <OrbitalAgent 
                    key={sa.id}
                    name={sa.name}
                    role={sa.role}
                    status={sa.status}
                    progress={sa.progress}
                    currentLog={sa.currentLog}
                    isSpeaking={activeSubAgent === sa.id}
                    angle={orbitalAngles[index]}
                    radius={radius}
                    colorClass={colors[index]}
                    delay={index * 0.2}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            <SynthesisPanel phase={phase} activeTemplate={activeTemplate} />
          </AnimatePresence>

          <CinematicConsole phase={phase} promptText={activeTemplate?.prompt || ""} />
        </>
      )}
      
    </div>
  );
}
