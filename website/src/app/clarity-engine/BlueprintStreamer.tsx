'use client';

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './BlueprintStreamer.module.css';
import { type BlueprintRequestBody } from '@/lib/clarity-engine/blueprintStreamer';
import { Loader2, X } from 'lucide-react';

interface BlueprintStreamerProps {
  title: string;
  endpoint: string;
  icon: React.ReactNode;
  payload: BlueprintRequestBody;
  agentId: 'strategy' | 'systems' | 'presence';
  onComplete?: () => void;
}

const getSimulatedLogs = (title: string) => {
  if (title.includes('Strategy')) {
    return [
      'Establishing connection to orchestration core...',
      'Analyzing initial founder signal & market position...',
      'Cross-referencing historical workflows...',
      'Synthesizing core business problem...',
      'Structuring audience clarity definitions...',
      'Generating value proposition architecture...',
      'Finalizing strategic direction...'
    ];
  }
  if (title.includes('Systems')) {
    return [
      'Initializing system architecture audit...',
      'Mapping current operational friction points...',
      'Identifying repetitive tasks and bottlenecks...',
      'Drafting proposed AI agent integrations...',
      'Designing streamlined delivery mechanisms...',
      'Compiling operational toolstack...',
      'Finalizing workflow blueprint...'
    ];
  }
  return [
    'Connecting to brand presence matrix...',
    'Evaluating optimal content distribution platforms...',
    'Structuring cinematic narrative pillars...',
    'Designing audience engagement loops...',
    'Drafting content repurposing pipeline...',
    'Aligning visual identity guidelines...',
    'Finalizing presence brief...'
  ];
};

export default function BlueprintStreamer({ title, endpoint, icon, payload, agentId, onComplete }: BlueprintStreamerProps) {
  const [content, setContent] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const logs = useRef(getSimulatedLogs(title));
  
  // Wait to start simulation until agent appears (CSS animation delay is ~2-3s)
  const delayStartMs = agentId === 'strategy' ? 2200 : agentId === 'systems' ? 2700 : 3200;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCurrentLogIndex((prev) => {
          if (prev >= logs.current.length - 1) {
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
  }, [delayStartMs]);

  const isSimulating = currentLogIndex < logs.current.length - 1;
  const isActive = isFetching || isSimulating;

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const streamBlueprint = async () => {
      // Delay fetch slightly to match animation start
      await new Promise(r => setTimeout(r, delayStartMs));
      
      try {
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
          onComplete?.();
        }
      }
    };

    void streamBlueprint();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [endpoint, payload, delayStartMs, onComplete]);

  const blobClass = agentId === 'strategy' 
    ? styles.blobStrategy 
    : agentId === 'systems' 
      ? styles.blobSystems 
      : styles.blobPresence;

  return (
    <>
      <div className={`${styles.streamerCard} ${isActive ? styles.isActive : ''}`}>
        <div className={styles.header}>
          <div className={styles.agentBlobWrapper}>
            <div className={`${styles.agentBlob} ${blobClass}`} />
          </div>
          <h3 className={styles.title}>{title}</h3>
          <div className={`${styles.statusIndicator} ${isActive ? styles.pulse : ''}`} />
        </div>
        
        {isActive ? (
          <div className={styles.simulatedLog}>
            <Loader2 size={14} className={styles.spin} />
            <span>{logs.current[currentLogIndex]}</span>
          </div>
        ) : (
          <div className={styles.simulatedLog}>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Task completed.</span>
          </div>
        )}

        {!isActive && (
          <div className={styles.actions}>
            <button className={styles.viewBtn} onClick={() => setIsModalOpen(true)}>
              View Report
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {icon}
                {title} Report
              </h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </header>
            <div className={styles.modalBody}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
