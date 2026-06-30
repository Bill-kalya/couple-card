import styles from './CategoryPicker.module.css';

export default function CategoryPicker({ categories, onSelect }) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Choose a category</h2>
      <p className={styles.sub}>Pick the theme for this card</p>
      <div className={styles.grid}>
        {Object.entries(categories).map(([key, cat]) => (
          <button
            key={key}
            className={styles.catBtn}
            style={{ '--c': cat.color, '--g': cat.glow }}
            onClick={() => onSelect(key)}
          >
            <span className={styles.icon}>{cat.label.split(' ')[0]}</span>
            <span className={styles.name}>{cat.label.split(' ').slice(1).join(' ')}</span>
            <div className={styles.shine} />
          </button>
        ))}
      </div>
    </div>
  );
}
