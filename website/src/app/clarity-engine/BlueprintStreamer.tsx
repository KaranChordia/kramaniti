'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './BlueprintStreamer.module.css';
import { type BlueprintRequestBody } from '@/lib/clarity-engine/blueprintStreamer';
import { Check, ArrowRight } from 'lucide-react';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface BlueprintStreamerProps {
  title: string;
  endpoint: string;
  icon: React.ReactNode;
  payload: BlueprintRequestBody;
  agentId: 'strategy' | 'systems' | 'presence';
  onComplete?: () => void;
  onViewReport?: (content: string) => void;
  onContentReady?: (agentId: 'strategy' | 'systems' | 'presence', content: string) => void;
}

const getSimulatedLogs = (title: string) => {
  if (title.includes('Strategy')) {
    return [
      'Scanning transcript history...',
      'Isolating primary business workflow...',
      'Deriving target audience patterns...',
      'Generating strategic foundation...'
    ];
  }
  if (title.includes('Systems')) {
    return [
      'Analyzing current workarounds...',
      'Identifying high-friction touchpoints...',
      'Designing system architecture...',
      'Orchestrating agent workflows...'
    ];
  }
  return [
    'Mapping presence goals...',
    'Reviewing preferred content channels...',
    'Synthesizing brand authority angles...',
    'Compiling 30-day presence plan...'
  ];
};

export default function BlueprintStreamer({ title, endpoint, icon, payload, agentId, onComplete, onViewReport, onContentReady }: BlueprintStreamerProps) {
  const [content, setContent] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const hasNotifiedComplete = useRef(false);
  const logs = useMemo(() => getSimulatedLogs(title), [title]);
  const { playClick } = useAudioEngine();
  
  // Wait to start simulation until agent card appears
  const delayStartMs = agentId === 'strategy' ? 3600 : agentId === 'systems' ? 3800 : 4000;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCurrentLogIndex((prev) => {
          if (prev >= logs.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1500); // Slower updates (1.5 seconds per log)
    }, delayStartMs);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [delayStartMs, logs.length]);

  const isSimulating = currentLogIndex < logs.length - 1;
  const isActive = isFetching || isSimulating;

  useEffect(() => {
    if (isActive || hasNotifiedComplete.current) return;

    hasNotifiedComplete.current = true;
    onContentReady?.(agentId, content);
    onComplete?.();
  }, [agentId, content, isActive, onComplete, onContentReady]);

  useEffect(() => {
    if (!content.trim()) return;
    onContentReady?.(agentId, content);
  }, [agentId, content, onContentReady]);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const streamBlueprint = async () => {
      // Delay fetch slightly to match animation start
      await new Promise(r => setTimeout(r, delayStartMs));
      
      try {
        if (payload.mockScenarioId) {
          const { mockScenarios } = await import('@/lib/clarity-engine/mockData');
          const scenario = mockScenarios.find(s => s.id === payload.mockScenarioId);
          if (scenario) {
            const mockMarkdown = scenario.blueprint[agentId as keyof typeof scenario.blueprint];
            if (mockMarkdown) {
              // Simulate streaming chunks
              const chunks = mockMarkdown.match(/[\s\S]{1,15}/g) || [];
              for (const chunk of chunks) {
                if (!isMounted || abortController.signal.aborted) break;
                setContent((prev) => prev + chunk);
                await new Promise(r => setTimeout(r, 20)); // fast typewriter
              }
              return; // Bypass actual fetch
            }
          }
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error('Failed to start stream');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          if (isMounted) {
            setContent((prev) => prev + chunk);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error(`Error streaming from ${endpoint}:`, error);
        if (isMounted) {
          setContent((prev) => prev + '\n\n*Error generating this section.*');
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    void streamBlueprint();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [endpoint, payload, delayStartMs, onComplete, agentId]);

  const blobClass = agentId === 'strategy' 
    ? styles.blobStrategy 
    : agentId === 'systems' 
      ? styles.blobSystems 
      : styles.blobPresence;

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div 
        className={`${styles.agentBlobWrapper} blobContainer ${isActive ? styles.blobActive : ''}`} 
        style={{ position: 'absolute', top: '32px', left: '24px', zIndex: 10 }}
      >
        <div className={`${styles.agentBlob} ${blobClass}`} />
      </div>
      <div className={`${styles.streamerCard} ${isActive ? styles.isActive : ''} cardContainer`} style={{ width: '100%' }}>
        <div className={styles.header}>
          {/* Spacer to reserve room for the absolutely positioned blob */}
          <div style={{ width: '48px', height: '48px', opacity: 0 }} aria-hidden="true">
            {icon}
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
      
      <div className={styles.logList}>
        {logs.slice(0, currentLogIndex + 1).map((log, i) => {
          const isCurrentLog = i === currentLogIndex;
          const isDone = !isCurrentLog || (!isActive && isCurrentLog);

          return (
            <div key={i} className={styles.logItemWrapper}>
              <div 
                className={`${styles.logItem} ${isDone ? styles.logItemDone : styles.logItemActive}`}
              >
                <div className={styles.logStatusIcon}>
                {isDone ? (
                  <Check size={14} strokeWidth={3} className={styles.checkIcon} />
                ) : (
                  <div className={styles.miniProgressBar}>
                    <div className={styles.miniProgressFill} />
                  </div>
                )}
              </div>
              <span>{log}</span>
            </div>
          </div>
          );
        })}
      </div>

      {!isActive && (
        <button 
          className={styles.fullWidthBtn} 
          onClick={(e) => { e.stopPropagation(); playClick(); onViewReport?.(content); }}
        >
          <span>Read Report</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
    </div>
  );
}
