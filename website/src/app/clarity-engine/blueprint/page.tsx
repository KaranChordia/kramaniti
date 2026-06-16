'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Compass, Layers, Megaphone, Loader2, Volume2, VolumeX } from 'lucide-react';
import styles from './BlueprintPage.module.css';
import engineStyles from '../ClarityEngine.module.css';
import BlueprintStreamer from '../BlueprintStreamer';
import { type BlueprintRequestBody } from '@/lib/clarity-engine/blueprintStreamer';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import ReportReader from './ReportReader';

interface ActiveReport {
  agentId: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

export default function BlueprintPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<BlueprintRequestBody | null>(null);
  const [completedAgents, setCompletedAgents] = useState(0);
  const [activeReport, setActiveReport] = useState<ActiveReport | null>(null);
  const { playSuccess, startAmbient, playClick, isAmbientMuted, toggleAmbientMute } = useAudioEngine();

  useEffect(() => {
    startAmbient();
  }, [startAmbient]);

  useEffect(() => {
    const sessionData = sessionStorage.getItem('kramaniti-blueprint-session');
    if (sessionData) {
      try {
        setPayload(JSON.parse(sessionData));
      } catch (err) {
        console.error("Failed to parse blueprint session data", err);
      }
    } else {
      router.push('/clarity-engine');
    }
  }, [router]);

  const handleAgentComplete = useCallback(() => {
    setCompletedAgents(prev => {
      const nextCount = prev + 1;
      if (nextCount === 3) {
        playSuccess();
      }
      return nextCount;
    });
  }, [playSuccess]);

  if (!payload) {
    return (
      <div className={engineStyles.canvas}>
        <div className={engineStyles.canvasBgGlow} />
        <div className={engineStyles.canvasNoise} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p>Loading your session data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={engineStyles.canvas} style={{ overflow: 'hidden' }} onClick={startAmbient}>
      <div className={engineStyles.canvasBgGlow} />
      <div className={engineStyles.canvasNoise} />
      
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={(e) => { e.stopPropagation(); playClick(); router.push('/clarity-engine'); }}>
            <ChevronLeft size={20} />
          </button>
          <h1 className={styles.headerTitle}>Your Growth Blueprint</h1>
        </div>
        <div className={styles.headerActions} style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
          <button 
            className={engineStyles.actionBtn} 
            onClick={(e) => { 
              e.stopPropagation();
              playClick(); 
              toggleAmbientMute(); 
            }}
            title={isAmbientMuted ? "Unmute Ambient Audio" : "Mute Ambient Audio"}
          >
            {isAmbientMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </header>

      <main className={styles.mainTree}>
        {/* Central Hub / AI Blob */}
        <div className={styles.hubContainer}>
          <div className={`${engineStyles.blobWrapper} ${engineStyles.charThinking}`}>
            <div className={engineStyles.orbit1} />
            <div className={engineStyles.orbit2} />
            <div className={engineStyles.assistantBlob} />
          </div>
          <span className={styles.hubTitle}>Clarity Engine Orchestrator</span>
        </div>

        {/* Desktop Connector Lines */}
        <svg className={styles.connectorLines} viewBox="0 0 1200 100" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(201, 168, 76, 0.6)" />
              <stop offset="100%" stopColor="rgba(201, 168, 76, 0.1)" />
            </linearGradient>
          </defs>
          <path className={styles.connectorLinePath} style={{ animationDelay: '1.2s' }} d="M 600 0 L 200 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6" />
          <path className={styles.connectorLinePath} style={{ animationDelay: '1.4s' }} d="M 600 0 L 600 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6" />
          <path className={styles.connectorLinePath} style={{ animationDelay: '1.6s' }} d="M 600 0 L 1000 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6" />
        </svg>

        {/* 3 Agents */}
        <div className={styles.agentsGrid}>
          <div className={styles.agentSlot}>
            <BlueprintStreamer
              title="Strategy & Clarity"
              endpoint="/api/clarity-engine/blueprint/strategy/"
              icon={<Compass size={24} color="rgba(201, 168, 76, 1)" />}
              payload={payload}
              agentId="strategy"
              onComplete={handleAgentComplete}
              onViewReport={(content) => setActiveReport({
                agentId: 'strategy',
                title: 'Strategy & Clarity',
                content,
                icon: <Compass size={24} color="rgba(255, 255, 255, 0.9)" />
              })}
            />
          </div>
          
          <div className={styles.agentSlot}>
            <BlueprintStreamer
              title="Systems & Workflow"
              endpoint="/api/clarity-engine/blueprint/systems/"
              icon={<Layers size={24} color="rgba(201, 168, 76, 1)" />}
              payload={payload}
              agentId="systems"
              onComplete={handleAgentComplete}
              onViewReport={(content) => setActiveReport({
                agentId: 'systems',
                title: 'Systems & Workflow',
                content,
                icon: <Layers size={24} color="rgba(255, 255, 255, 0.9)" />
              })}
            />
          </div>
          
          <div className={styles.agentSlot}>
            <BlueprintStreamer
              title="Brand & Presence"
              endpoint="/api/clarity-engine/blueprint/presence/"
              icon={<Megaphone size={24} color="rgba(201, 168, 76, 1)" />}
              payload={payload}
              agentId="presence"
              onComplete={handleAgentComplete}
              onViewReport={(content) => setActiveReport({
                agentId: 'presence',
                title: 'Brand & Presence',
                content,
                icon: <Megaphone size={24} color="rgba(255, 255, 255, 0.9)" />
              })}
            />
          </div>
        </div>
      </main>

      {activeReport && (
        <ReportReader 
          report={activeReport} 
          onClose={() => setActiveReport(null)} 
        />
      )}
    </div>
  );
}
