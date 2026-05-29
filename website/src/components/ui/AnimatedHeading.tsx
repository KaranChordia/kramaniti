import styles from './AnimatedHeading.module.css';

type AnimatedHeadingProps = {
  as?: 'h2' | 'h3';
  children: string;
  className?: string;
  isVisible: boolean;
};

export function AnimatedHeading({
  as: Tag = 'h2',
  children,
  className = '',
  isVisible,
}: AnimatedHeadingProps) {
  const words = children.split(' ');

  return (
    <Tag className={`${styles.heading} ${isVisible ? styles.visible : ''} ${className}`}>
      {words.map((word, index) => (
        <span
          // The text is static, so word + index is stable and avoids altering the copy model.
          key={`${word}-${index}`}
          className={styles.word}
          style={{ '--word-index': index } as React.CSSProperties}
        >
          {word}
          {index < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </Tag>
  );
}
