'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { Insight } from '../../data/insights';
import styles from './Insights.module.css';

type ArchiveItem = Omit<Insight, 'content'>;
type CategoryFilter = 'All' | Insight['category'];
type SortMode = 'newest' | 'oldest';

const categoryFilters: CategoryFilter[] = [
  'All',
  'Strategy',
  'Systems',
  'Adoption',
  'Governance',
  'Content',
  'AI Infrastructure',
  'Spatial',
];

function getTimeValue(insight: ArchiveItem) {
  return new Date(insight.publishedAt ?? insight.date).getTime();
}

function getDisplayMeta(insight: ArchiveItem) {
  if (insight.publishedAt) {
    const publishedAt = new Date(insight.publishedAt);
    const date = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(publishedAt);
    const time = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(publishedAt);

    return `${date} · ${time} IST`;
  }

  return insight.date;
}

function InsightCard({ insight }: { insight: ArchiveItem }) {
  return (
    <Link href={`/insights/${insight.slug}`} className={styles.insightCard}>
      <div className={styles.cardHeader}>
        <span className={styles.focus}>{insight.focus}</span>
        <span className={styles.date}>{getDisplayMeta(insight)}</span>
      </div>
      <h2>{insight.title}</h2>
      <p className={styles.summary}>{insight.summary}</p>
      <div className={styles.cardFooter}>
        <span className={styles.readTime}>
          {insight.author ? `${insight.author} · ${insight.readTime}` : insight.readTime}
        </span>
        <span className={styles.readMore}>
          Read Article
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function InsightsArchive({ insights }: { insights: ArchiveItem[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const deferredQuery = useDeferredValue(query);

  const sortedInsights = useMemo(() => {
    return [...insights].sort((a, b) => getTimeValue(b) - getTimeValue(a));
  }, [insights]);

  const featuredInsight = sortedInsights[0];

  const filteredInsights = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return sortedInsights
      .filter((insight) => {
        if (activeCategory !== 'All' && insight.category !== activeCategory) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchableText = [
          insight.title,
          insight.summary,
          insight.focus,
          insight.category,
        ].join(' ').toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .sort((a, b) => {
        const diff = getTimeValue(b) - getTimeValue(a);
        return sortMode === 'newest' ? diff : -diff;
      });
  }, [activeCategory, deferredQuery, sortMode, sortedInsights]);

  const hasActiveFilter = activeCategory !== 'All' || query.trim().length > 0;
  const resultLabel = filteredInsights.length === 1 ? '1 insight' : `${filteredInsights.length} insights`;

  return (
    <div className={styles.archiveShell}>
      {featuredInsight ? (
        <section className={styles.featuredSection} aria-label="Latest insight">
          <div className={styles.sectionLabel}>Latest article</div>
          <Link href={`/insights/${featuredInsight.slug}`} className={styles.featuredCard}>
            <div className={styles.featuredMeta}>
              <span className={styles.categoryPill}>{featuredInsight.category}</span>
              <span>{getDisplayMeta(featuredInsight)}</span>
            </div>
            <h2>{featuredInsight.title}</h2>
            <p>{featuredInsight.summary}</p>
            <span className={styles.featuredLink}>Read latest article</span>
          </Link>
        </section>
      ) : null}

      <section className={styles.archiveControls} aria-label="Insight filters">
        <div className={styles.searchField}>
          <Search aria-hidden="true" size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, topic, or summary"
            aria-label="Search insights"
          />
        </div>

        <label className={styles.sortControl}>
          <span>Sort</span>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </section>

      <div className={styles.categoryRail} aria-label="Insight categories">
        {categoryFilters.map((category) => (
          <button
            key={category}
            type="button"
            className={`${styles.categoryButton} ${activeCategory === category ? styles.categoryButtonActive : ''}`}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.resultsHeader}>
        <span>{resultLabel}</span>
        {hasActiveFilter ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => {
              setActiveCategory('All');
              setQuery('');
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filteredInsights.length > 0 ? (
        <div className={styles.insightsGrid}>
          {filteredInsights.map((insight) => (
            <InsightCard insight={insight} key={insight.slug} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No insights match this view.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setQuery('');
            }}
          >
            Reset archive
          </button>
        </div>
      )}
    </div>
  );
}
