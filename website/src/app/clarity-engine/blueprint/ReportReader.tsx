import React from 'react';
import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ReportReader.module.css';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface ReportReaderProps {
  report: {
    agentId: string;
    title: string;
    content: string;
    icon: React.ReactNode;
  };
  onClose: () => void;
}

export default function ReportReader({ report, onClose }: ReportReaderProps) {
  const { playClick } = useAudioEngine();

  return (
    <div className={styles.readerContainer}>
      <div className={styles.readerHeader}>
        <button 
          className={styles.backButton} 
          onClick={() => { playClick(); onClose(); }}
        >
          <ChevronLeft size={20} />
          <span>Back to Blueprint Grid</span>
        </button>
        <div className={styles.agentInfo}>
          <div className={`${styles.agentIcon} ${styles[`blob${report.agentId}`]}`}>
            {report.icon}
          </div>
          <h2>{report.title} Report</h2>
        </div>
      </div>

      <div className={styles.readerContentWrapper}>
        <div className={styles.readerContent}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
