import React from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ReportReader.module.css';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import Image from 'next/image';

const normalizeReportMarkdown = (content: string) =>
  content
    .replace(/^[ \t]*#{1,6}[ \t]*$/gm, '')
    .replace(/([^\n#])(#{2,6}\s+)/g, '$1\n\n$2')
    .replace(/([^\n])(-\s+)/g, '$1\n$2')
    .replace(/(#{2,6}\s+[^\n#-]+?)(#{2,6}\s+)/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

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
  const normalizedContent = normalizeReportMarkdown(report.content);

  return (
    <div 
      className={styles.readerCanvasOverlay} 
      onClick={() => { playClick(); onClose(); }}
    >
      <button 
        className={styles.closeFloatingBtn} 
        onClick={(e) => { e.stopPropagation(); playClick(); onClose(); }}
        aria-label="Close report"
      >
        <X size={24} />
      </button>

      <div className={styles.floatingReportCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cardHeader}>
          <Image 
            src="/assets/brand/kramaniti-mark-gold.png" 
            alt="Kramaniti" 
            width={144}
            height={144}
            className={styles.kramanitiLogo} 
          />
          <div className={styles.agentIcon}>
            {report.icon}
          </div>
          <h2>{report.title} Blueprint</h2>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.markdownWrapper}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {normalizedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
