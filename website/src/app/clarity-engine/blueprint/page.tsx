'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Compass, Layers, Megaphone, Loader2, Moon, Save, Sun, Volume2, VolumeX } from 'lucide-react';
import styles from './BlueprintPage.module.css';
import engineStyles from '../ClarityEngine.module.css';
import BlueprintStreamer from '../BlueprintStreamer';
import { type BlueprintRequestBody } from '@/lib/clarity-engine/blueprintStreamer';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import ReportReader from './ReportReader';
import { useKramanitiTheme } from '@/hooks/useKramanitiTheme';
import { getClarityCircleSupabase, type ClarityCircleProjectReport } from '@/lib/clarity-circle/supabase';

interface ActiveReport {
  agentId: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

type ReportType = ClarityCircleProjectReport['report_type'];

const REPORT_TITLES: Record<ReportType, string> = {
  strategy: 'Strategy & Clarity Blueprint',
  systems: 'Systems & Workflow Blueprint',
  presence: 'Brand & Presence Blueprint',
};

export default function BlueprintPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<BlueprintRequestBody | null>(null);
  const [hasLoadedPayload, setHasLoadedPayload] = useState(false);
  const [completedAgents, setCompletedAgents] = useState(0);
  const [activeReport, setActiveReport] = useState<ActiveReport | null>(null);
  const [reportContents, setReportContents] = useState<Partial<Record<ReportType, string>>>({});
  const [isSavingReports, setIsSavingReports] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const { playSuccess, startAmbient, playClick, isAmbientMuted, toggleAmbientMute } = useAudioEngine();
  const { theme, toggleTheme } = useKramanitiTheme();

  useEffect(() => {
    startAmbient();
  }, [startAmbient]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const sessionData = sessionStorage.getItem('kramaniti-blueprint-session');

      if (sessionData) {
        try {
          setPayload(JSON.parse(sessionData) as BlueprintRequestBody);
        } catch (err) {
          console.error("Failed to parse blueprint session data", err);
        }
      }

      setHasLoadedPayload(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasLoadedPayload && !payload) {
      router.push('/clarity-engine');
    }
  }, [hasLoadedPayload, payload, router]);

  const handleAgentComplete = useCallback(() => {
    setCompletedAgents(prev => {
      const nextCount = prev + 1;
      if (nextCount === 3) {
        playSuccess();
      }
      return nextCount;
    });
  }, [playSuccess]);

  const handleContentReady = useCallback((agentId: ReportType, content: string) => {
    setReportContents((current) => ({
      ...current,
      [agentId]: content,
    }));
  }, []);

  const canSaveReports =
    Boolean(payload?.circleProject?.projectId) &&
    completedAgents >= 3 &&
    Boolean(reportContents.strategy?.trim() && reportContents.systems?.trim() && reportContents.presence?.trim());

  const saveReportsToProject = async () => {
    if (!payload?.circleProject?.projectId || !canSaveReports) return;

    const supabase = getClarityCircleSupabase();
    if (!supabase) {
      setSaveStatus('Project report storage is not available.');
      return;
    }

    setIsSavingReports(true);
    setSaveStatus('Saving reports to the project...');

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData.user;

    if (userError || !user) {
      setIsSavingReports(false);
      setSaveStatus('Sign in to save reports to the project.');
      return;
    }

    const rows = (['strategy', 'systems', 'presence'] as ReportType[]).map((reportType) => ({
      project_id: payload.circleProject?.projectId as string,
      user_id: user.id,
      report_type: reportType,
      title: REPORT_TITLES[reportType],
      content: reportContents[reportType]?.trim() || '',
      source: 'clarity_engine' as const,
      metadata: {
        saved_from: 'clarity_engine_blueprint',
        project_title: payload.circleProject?.projectTitle,
        folder_id: payload.circleProject?.folderId ?? null,
        folder_name: payload.circleProject?.folderName || null,
        saved_at: new Date().toISOString(),
      },
    }));

    const { error: reportError } = await supabase.schema('clarity_circle').from('project_reports').insert(rows);

    if (reportError) {
      setIsSavingReports(false);
      setSaveStatus('Reports could not be saved. The project reports migration may need to be applied.');
      return;
    }

    await supabase.schema('clarity_circle').from('context_entries').insert({
      project_id: payload.circleProject.projectId,
      user_id: user.id,
      entry_type: 'brief',
      payload: {
        source: 'clarity_engine_blueprint',
        report_count: rows.length,
        report_titles: rows.map((row) => row.title),
        project_title: payload.circleProject.projectTitle,
        folder_id: payload.circleProject.folderId ?? null,
        saved_at: new Date().toISOString(),
      },
    });

    setIsSavingReports(false);
    setSaveStatus('All three reports saved to the project.');
  };

  if (!hasLoadedPayload || !payload) {
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
    <div className={`${engineStyles.canvas} ${styles.blueprintCanvas}`} onClick={startAmbient}>
      <div className={engineStyles.canvasBgGlow} />
      <div className={engineStyles.canvasNoise} />
      
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={(e) => { e.stopPropagation(); playClick(); router.push('/clarity-engine'); }}
            aria-label="Back to Clarity Engine"
            title="Back to Clarity Engine"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className={styles.headerTitle}>Your Growth Blueprint</h1>
        </div>
        <div className={styles.headerActions}>
          {payload.circleProject?.projectId && (
            <button
              className={styles.saveProjectBtn}
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                void saveReportsToProject();
              }}
              disabled={!canSaveReports || isSavingReports}
              title="Save all reports to the originating project"
            >
              {isSavingReports ? <Loader2 size={14} className={styles.spin} /> : <Save size={14} />}
              <span>{isSavingReports ? 'Saving...' : 'Save all to project'}</span>
            </button>
          )}
          <button
            className={styles.headerIconBtn}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              toggleTheme();
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button 
            className={styles.headerIconBtn}
            onClick={(e) => { 
              e.stopPropagation();
              playClick(); 
              toggleAmbientMute(); 
            }}
            title={isAmbientMuted ? "Unmute Ambient Audio" : "Mute Ambient Audio"}
            aria-label={isAmbientMuted ? "Unmute Ambient Audio" : "Mute Ambient Audio"}
          >
            {isAmbientMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </header>

      <main className={styles.mainTree}>
        {/* Central Hub / AI Blob */}
        <div className={styles.hubContainer}>
          <div className={`${engineStyles.blobWrapper} ${completedAgents < 3 ? engineStyles.charThinking : ''}`}>
            <div className={engineStyles.orbit1} />
            <div className={engineStyles.orbit2} />
            <div className={engineStyles.assistantBlob} />
          </div>
          <span className={styles.hubTitle}>Clarity Engine Orchestrator</span>
          {payload.circleProject?.projectTitle && (
            <div className={styles.projectSavePanel}>
              <span>{payload.circleProject.folderName || 'Project folder'}</span>
              <strong>{payload.circleProject.projectTitle}</strong>
              <small>{saveStatus || (canSaveReports ? 'Reports are ready to save.' : 'Reports will be ready when all three agents finish.')}</small>
            </div>
          )}
        </div>

        {/* Connector Lines Removed - Replaced by Blob Spawn Animation */}

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
              onContentReady={handleContentReady}
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
              onContentReady={handleContentReady}
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
              onContentReady={handleContentReady}
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
