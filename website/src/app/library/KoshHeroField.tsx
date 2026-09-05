import styles from "./editorial.module.css";

// Echo the homepage's circuit geometry without adding a continuous animation loop.
export function KoshHeroField() {
  return (
    <div className={styles.heroField} aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M-20 214 H252 V126 H410" />
        <path d="M1032 124 H1194 V294 H1460" />
        <path d="M-20 700 H304 V790 H462" />
        <path d="M1038 726 H1248 V920" />
        <path d="M520 -20 V106 H666" />
        <path d="M842 900 V798 H972" />
        <path d="M-20 390 H170 V320 H330" />
        <path d="M1460 500 H1290 V410 H1125" />
        <path d="M690 -20 V72 H770 V155" />
        <path d="M670 920 V842 H558" />
        {[
          [252, 214],
          [1194, 294],
          [304, 700],
          [1248, 726],
          [520, 106],
          [842, 798],
          [170, 390],
          [1290, 500],
          [690, 72],
          [670, 842],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" />
        ))}
      </svg>
    </div>
  );
}
