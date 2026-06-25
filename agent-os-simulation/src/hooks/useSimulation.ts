import { useState, useEffect, useRef } from 'react';
import { VoiceManager } from '../lib/VoiceManager';

export interface SubAgentState {
  id: string;
  name: string;
  role: string;
  status: 'Idle' | 'Working' | 'Complete';
  progress: number;
  currentLog: string;
  logHistory: string[];
}

export interface SimulationTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  synthesisData: {
    metrics: { label: string; value: string; desc: string }[];
  };
  agents: {
    id: string;
    name: string;
    role: string;
    duration: number;
    voiceText: string;
    logs: string[];
  }[];
}

export const TEMPLATES: SimulationTemplate[] = [
  {
    id: 't1', title: 'Initialize Web Project', description: 'Architect Next.js core, UI engine, and assets.',
    prompt: 'Please Initialize Web Project & Optimize Assets. Set up architecture, design UI, and optimize.',
    synthesisData: { metrics: [
      { label: 'Architecture', value: 'Edge-Ready', desc: 'Next.js core initialized. API routes compiled.' },
      { label: 'UI Engine', value: 'Glassmorphism', desc: 'Framer physics synchronized across all nodes.' },
      { label: 'Assets', value: '84kb Bundle', desc: 'Media compressed. Payload reduced by 42%.' }
    ]},
    agents: [
      { id: 'sa-1', name: 'Alpha', role: 'ARCHITECT', duration: 5000, voiceText: 'Alpha here. Architecting the foundational project structure.', logs: ['Bootstrapping Next.js App Router...', 'Configuring TypeScript strict mode...', 'Injecting Tailwind CSS tokens...', 'Resolving dependency graphs...'] },
      { id: 'sa-2', name: 'Beta', role: 'DESIGNER', duration: 5500, voiceText: 'Beta online. Designing the orbital HUD interface.', logs: ['Loading Glassmorphism preset...', 'Mapping Z-indexes...', 'Applying matte slate gradients...', 'Synchronizing Framer Motion physics...'] },
      { id: 'sa-3', name: 'Gamma', role: 'ENGINEER', duration: 4500, voiceText: 'Gamma engaged. Compiling and optimizing final assets.', logs: ['Compressing SVG assets...', 'Minifying JavaScript bundles...', 'Executing tree-shaking...', 'Running final build tests...'] }
    ]
  },
  {
    id: 't2', title: 'Database Migration', description: 'Zero-downtime schema sync and indexing.',
    prompt: 'Execute zero-downtime database migration. Sync new schema and rebuild indexes.',
    synthesisData: { metrics: [
      { label: 'Schema', value: 'Synced', desc: 'PostgreSQL tables successfully altered.' },
      { label: 'Indexes', value: 'Rebuilt', desc: 'B-tree indexes optimized for read-heavy queries.' },
      { label: 'Downtime', value: '0.0s', desc: 'Migration completed with zero connection drops.' }
    ]},
    agents: [
      { id: 'sa-1', name: 'Alpha', role: 'DBA', duration: 4000, voiceText: 'Alpha here. Acquiring migration locks.', logs: ['Checking cluster health...', 'Acquiring exclusive locks...', 'Validating migration checksums...'] },
      { id: 'sa-2', name: 'Beta', role: 'MIGRATOR', duration: 6000, voiceText: 'Beta online. Executing schema alterations.', logs: ['Altering table users...', 'Adding foreign key constraints...', 'Backfilling missing column data...', 'Verifying row counts...'] },
      { id: 'sa-3', name: 'Gamma', role: 'OPTIMIZER', duration: 4500, voiceText: 'Gamma engaged. Rebuilding indexes.', logs: ['Dropping old indexes...', 'Creating concurrent B-Tree index...', 'Updating table statistics...', 'Migration commit successful.'] }
    ]
  },
  {
    id: 't3', title: 'Security Audit', description: 'Automated penetration testing and vulnerability scan.',
    prompt: 'Run automated penetration test on production endpoints and report vulnerabilities.',
    synthesisData: { metrics: [
      { label: 'Endpoints', value: '142 Scanned', desc: 'All public and private API routes tested.' },
      { label: 'Vulnerabilities', value: '0 Critical', desc: '2 Low severity warnings patched automatically.' },
      { label: 'WAF', value: 'Enforced', desc: 'Rate limiting and SQLi protection verified active.' }
    ]},
    agents: [
      { id: 'sa-1', name: 'Alpha', role: 'SCANNER', duration: 5500, voiceText: 'Alpha here. Initiating surface area scan.', logs: ['Mapping exposed endpoints...', 'Checking TLS configurations...', 'Scanning for open ports...'] },
      { id: 'sa-2', name: 'Beta', role: 'PENTESTER', duration: 7000, voiceText: 'Beta online. Executing payload injections.', logs: ['Injecting SQLi payloads...', 'Testing XSS vectors...', 'Bypassing rate limits (failed)...', 'Checking JWT signing algorithms...'] },
      { id: 'sa-3', name: 'Gamma', role: 'ANALYST', duration: 4000, voiceText: 'Gamma engaged. Compiling threat report.', logs: ['Aggregating scan results...', 'Classifying severity levels...', 'Generating CVE manifest...', 'Audit complete.'] }
    ]
  },
  {
    id: 't4', title: 'Data ETL Pipeline', description: 'Extract, transform, and load user telemetry.',
    prompt: 'Initialize ETL pipeline for user telemetry data into the data warehouse.',
    synthesisData: { metrics: [
      { label: 'Extraction', value: '10M Rows', desc: 'Successfully pulled from raw S3 buckets.' },
      { label: 'Transformation', value: 'Cleaned', desc: 'Null values dropped, timestamps normalized.' },
      { label: 'Load', value: 'Snowflake', desc: 'Warehouse updated with latest partitions.' }
    ]},
    agents: [
      { id: 'sa-1', name: 'Alpha', role: 'EXTRACTOR', duration: 4500, voiceText: 'Alpha here. Connecting to raw data streams.', logs: ['Mounting S3 buckets...', 'Reading Parquet files...', 'Validating row integrity...'] },
      { id: 'sa-2', name: 'Beta', role: 'TRANSFORMER', duration: 6500, voiceText: 'Beta online. Normalizing telemetry data.', logs: ['Dropping null records...', 'Normalizing timezone to UTC...', 'Mapping JSON blobs to columns...', 'Aggregating session lengths...'] },
      { id: 'sa-3', name: 'Gamma', role: 'LOADER', duration: 5000, voiceText: 'Gamma engaged. Pushing to warehouse.', logs: ['Opening Snowflake connection...', 'Executing COPY INTO commands...', 'Verifying partition keys...', 'Pipeline commit successful.'] }
    ]
  },
  {
    id: 't5', title: 'Marketing Creative', description: 'Generate copy and visual assets for campaign.',
    prompt: 'Generate brand copy and visual assets for the upcoming Q3 product launch.',
    synthesisData: { metrics: [
      { label: 'Copywriting', value: '4 Variants', desc: 'A/B testing copy generated for socials.' },
      { label: 'Visuals', value: '12 Assets', desc: 'Banners, videos, and IG reels rendered.' },
      { label: 'Alignment', value: '100%', desc: 'Brand voice and hex codes strictly adhered to.' }
    ]},
    agents: [
      { id: 'sa-1', name: 'Alpha', role: 'STRATEGIST', duration: 4000, voiceText: 'Alpha here. Analyzing Q3 campaign goals.', logs: ['Reading brand guidelines...', 'Identifying target demographics...', 'Setting conversion KPIs...'] },
      { id: 'sa-2', name: 'Beta', role: 'COPYWRITER', duration: 5500, voiceText: 'Beta online. Drafting campaign copy.', logs: ['Drafting Twitter threads...', 'Writing email newsletter sequence...', 'Optimizing SEO headlines...', 'Refining call-to-actions...'] },
      { id: 'sa-3', name: 'Gamma', role: 'CREATIVE', duration: 6000, voiceText: 'Gamma engaged. Rendering visual assets.', logs: ['Generating 3D product renders...', 'Applying brand hex codes...', 'Exporting in 4K resolution...', 'Campaign package finalized.'] }
    ]
  }
];

export function useSimulation() {
  const [phase, setPhase] = useState<'Idle'|'Prompting'|'Thinking'|'Delegation'|'Execution'|'Synthesis'|'Complete'>('Idle');
  const [activeSubAgent, setActiveSubAgent] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<SimulationTemplate | null>(null);
  
  const [subAgents, setSubAgents] = useState<SubAgentState[]>([]);

  const updateSubAgent = (id: string, updates: Partial<SubAgentState>) => {
    setSubAgents(prev => prev.map(sa => sa.id === id ? { ...sa, ...updates } : sa));
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSimulation = (templateId: string) => {
    if (phase !== 'Idle') return;
    
    const template = TEMPLATES.find(t => t.id === templateId)!;
    setActiveTemplate(template);
    
    // Initialize Agents
    const initialAgents = template.agents.map(a => ({
      id: a.id, name: a.name, role: a.role, status: 'Idle' as const, progress: 0, currentLog: '', logHistory: []
    }));
    setSubAgents(initialAgents);
    
    // 1. Prompting Phase
    setPhase('Prompting');
    
    timerRef.current = setTimeout(() => {
      // 2. Thinking Phase
      setPhase('Thinking');
      
      timerRef.current = setTimeout(() => {
        // 3. Delegation Phase
        setPhase('Delegation');
        VoiceManager.speak(`I will now delegate the task: ${template.title} to the roster.`, 'Main Agent');
        
        timerRef.current = setTimeout(() => {
          // 4. Execution Phase
          setPhase('Execution');
          runAgentSimulation(template);
        }, 3500);

      }, 2000);
    }, 1500);
  };

  const runAgentSimulation = (template: SimulationTemplate) => {
    const runAgent = (agentId: string, duration: number, logs: string[], voiceText: string) => {
      return new Promise<void>((resolve) => {
        setActiveSubAgent(agentId);
        updateSubAgent(agentId, { status: 'Working' });
        VoiceManager.speak(voiceText, template.agents.find(a => a.id === agentId)?.name || '');

        let progress = 0;
        let logIndex = 0;
        const intervalTime = duration / 100;
        const logChangeInterval = 100 / logs.length;

        const interval = setInterval(() => {
          progress += 1;
          
          if (progress % Math.floor(logChangeInterval) === 0 && logIndex < logs.length) {
            const newLog = logs[logIndex];
            setSubAgents(prev => prev.map(sa => {
              if (sa.id === agentId) {
                return { ...sa, currentLog: newLog, logHistory: [...sa.logHistory, newLog] };
              }
              return sa;
            }));
            logIndex++;
          }
          
          updateSubAgent(agentId, { progress });

          if (progress >= 100) {
            clearInterval(interval);
            const doneLog = 'Task successfully completed.';
            setSubAgents(prev => prev.map(sa => {
              if (sa.id === agentId) {
                return { ...sa, status: 'Complete', currentLog: doneLog, logHistory: [...sa.logHistory, doneLog] };
              }
              return sa;
            }));
            setActiveSubAgent(null);
            resolve();
          }
        }, intervalTime);
      });
    };

    const runAll = async () => {
      for (const agent of template.agents) {
        await runAgent(agent.id, agent.duration, agent.logs, agent.voiceText);
      }

      // 5. Synthesis Phase
      setPhase('Synthesis');
      VoiceManager.speak('All sub-agents have reported back. Synthesizing final output.', 'Main Agent');
      
      setTimeout(() => {
        // 6. Complete
        setPhase('Complete');
        VoiceManager.speak(`${template.title} complete.`, 'Main Agent');
      }, 3500);
    };

    runAll();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { phase, subAgents, startSimulation, activeTemplate, activeSubAgent };
}
