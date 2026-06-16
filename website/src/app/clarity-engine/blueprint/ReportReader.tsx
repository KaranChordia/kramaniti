import React from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ReportReader.module.css';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import Image from 'next/image';

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
    <div className={styles.readerCanvasOverlay}>
      <button 
        className={styles.closeFloatingBtn} 
        onClick={() => { playClick(); onClose(); }}
        aria-label="Close report"
      >
        <X size={24} />
      </button>

      <div className={styles.floatingReportCard}>
        <div className={styles.cardHeader}>
          <Image 
            src="/assets/brand/kramaniti-mark-gold.png" 
            alt="Kramaniti" 
            width={48} 
            height={48} 
            className={styles.kramanitiLogo} 
          />
          <div className={`${styles.agentIcon} ${styles[`blob${report.agentId}`]}`}>
            {report.icon}
          </div>
          <h2>{report.title} Blueprint</h2>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.markdownWrapper}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
