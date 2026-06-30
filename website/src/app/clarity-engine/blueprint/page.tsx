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
import { getClaritySquareSupabase, type ClaritySquareProjectReport } from '@/lib/clarity-square/supabase';

interface ActiveReport {
  agentId: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

type ReportType = ClaritySquareProjectReport['report_type'];

const REPORT_TITLES: Record<ReportType, string> = {
  strategy: 'Strategy & Clarity Blueprint',
  systems: 'Systems & Workflow Blueprint',
  presence: 'Brand & Presence Blueprint',
};

type SaveProjectTarget = {
  projectId: string;
  folderId: string | null;
  projectTitle: string;
  folderName: string;
};

export default function BlueprintPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<BlueprintRequestBody | null>(null);
  const [hasLoadedPayload, setHasLoadedPayload] = useState(false);
  const [completedAgents, setCompletedAgents] = useState(0);
  const [activeReport, setActiveReport] = useState<ActiveReport | null>(null);
  const [reportContents, setReportContents] = useState<Partial<Record<ReportType, string>>>({});
  const [saveProjectOptions, setSaveProjectOptions] = useState<SaveProjectTarget[]>([]);
  const [selectedSaveProjectId, setSelectedSaveProjectId] = useState('');
  const [hasLoadedSaveProjects, setHasLoadedSaveProjects] = useState(false);
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

  useEffect(() => {
    if (!hasLoadedPayload || !payload || payload.squareProject?.projectId) return;

    const loadSaveProjects = async () => {
      const supabase = getClaritySquareSupabase();

      if (!supabase) {
        setHasLoadedSaveProjects(true);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setHasLoadedSaveProjects(true);
        return;
      }

      const [projectResult, folderResult] = await Promise.all([
        supabase
          .schema('clarity_square')
          .from('projects')
          .select('id,title,folder_id')
          .eq('user_id', userData.user.id)
          .eq('status', 'active')
          .order('updated_at', { ascending: false })
          .limit(40),
        supabase
          .schema('clarity_square')
          .from('project_folders')
          .select('id,name')
          .eq('user_id', userData.user.id)
          .eq('status', 'active'),
      ]);

      if (projectResult.error) {
        setSaveStatus('Saved projects could not be loaded. Return to Clarity Square and try again.');
        setHasLoadedSaveProjects(true);
        return;
      }

      const folderNames = new Map((folderResult.data ?? []).map((folder) => [folder.id, folder.name]));
      const options = (projectResult.data ?? []).map((project) => ({
        projectId: project.id,
        folderId: project.folder_id,
        projectTitle: project.title,
        folderName: project.folder_id ? folderNames.get(project.folder_id) || 'Project folder' : 'Unfiled',
      }));

      setSaveProjectOptions(options);
      setSelectedSaveProjectId((current) => current || options[0]?.projectId || '');
      setHasLoadedSaveProjects(true);
    };

    void loadSaveProjects();
  }, [hasLoadedPayload, payload]);

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

  const attachedSaveTarget = payload?.squareProject?.projectId
    ? {
        projectId: payload.squareProject.projectId,
        folderId: payload.squareProject.folderId ?? null,
        projectTitle: payload.squareProject.projectTitle,
        folderName: payload.squareProject.folderName || 'Project save',
      }
    : null;
  const selectedSaveProject = saveProjectOptions.find((project) => project.projectId === selectedSaveProjectId) ?? null;
  const saveTarget = attachedSaveTarget ?? selectedSaveProject;
  const reportsReady =
    completedAgents >= 3 &&
    Boolean(reportContents.strategy?.trim() && reportContents.systems?.trim() && reportContents.presence?.trim());
  const canSaveReports = Boolean(saveTarget?.projectId) && reportsReady;

  const saveReportsToProject = async () => {
    if (!reportsReady) {
      setSaveStatus('The save button will activate when all three reports finish.');
      return;
    }

    if (!saveTarget?.projectId) {
      setSaveStatus('Choose a project before saving these reports.');
      return;
    }

    const supabase = getClaritySquareSupabase();
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
      project_id: saveTarget.projectId,
      user_id: user.id,
      report_type: reportType,
      title: REPORT_TITLES[reportType],
      content: reportContents[reportType]?.trim() || '',
      source: 'clarity_engine' as const,
      metadata: {
        saved_from: 'clarity_engine_blueprint',
        project_title: saveTarget.projectTitle,
        folder_id: saveTarget.folderId,
        folder_name: saveTarget.folderName,
        saved_at: new Date().toISOString(),
      },
    }));

    const { error: reportError } = await supabase.schema('clarity_square').from('project_reports').insert(rows);

    if (reportError) {
      setIsSavingReports(false);
      setSaveStatus('Reports could not be saved. The project reports migration may need to be applied.');
      return;
    }

    await supabase.schema('clarity_square').from('context_entries').insert({
      project_id: saveTarget.projectId,
      user_id: user.id,
      entry_type: 'brief',
      payload: {
        source: 'clarity_engine_blueprint',
        report_count: rows.length,
        report_titles: rows.map((row) => row.title),
        project_title: saveTarget.projectTitle,
        folder_id: saveTarget.folderId,
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

        <section className={styles.saveReportsPanel} aria-label="Save blueprint reports">
          <div>
            <span>{saveTarget?.folderName || 'Project save'}</span>
            <strong>{saveTarget?.projectTitle || 'Save these reports to a project'}</strong>
            <small>
              {saveStatus ||
                (saveTarget?.projectId
                  ? reportsReady
                    ? 'All three reports are ready to save under this project.'
                    : 'The save button will activate when all three reports finish.'
                  : hasLoadedSaveProjects
                    ? 'Choose a saved project to recover this report save.'
                    : 'Looking for your saved projects...')}
            </small>
            {!attachedSaveTarget && saveProjectOptions.length > 0 && (
              <label className={styles.saveProjectPicker}>
                <span>Save destination</span>
                <select value={selectedSaveProjectId} onChange={(event) => setSelectedSaveProjectId(event.target.value)}>
                  {saveProjectOptions.map((project) => (
                    <option key={project.projectId} value={project.projectId}>
                      {project.projectTitle} - {project.folderName}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <button
            className={styles.saveReportsButton}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              void saveReportsToProject();
            }}
            disabled={!canSaveReports || isSavingReports}
            title="Save all reports to the originating project"
          >
            {isSavingReports ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />}
            <span>{isSavingReports ? 'Saving...' : 'Save this to your project'}</span>
          </button>
        </section>
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
