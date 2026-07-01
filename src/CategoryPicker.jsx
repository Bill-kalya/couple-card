import { useState } from 'react';
import styles from './CategoryPicker.module.css';

export default function CategoryPicker({ categories, onSelect, unlockedCategories = [] }) {
  const [confirmingLevel, setConfirmingLevel] = useState(null);
  const [confirmStep, setConfirmStep] = useState(0);

  const handleLevelTwoClick = () => {
    if (confirmStep === 0) {
      setConfirmStep(1);
    } else if (confirmStep === 1) {
      setConfirmStep(2);
    } else if (confirmStep === 2) {
      setConfirmStep(0);
      setConfirmingLevel(null);
      onSelect('level_two');
    }
  };

  const handleCancel = () => {
    setConfirmStep(0);
    setConfirmingLevel(null);
  };

  const confirmMessages = [
    { emoji: '😬', text: "Are you sure you want Level 2?" },
    { emoji: '😰', text: "Are you VERY VERY sure?" },
    { emoji: '😱', text: "What if someone gets mad? 😤" },
  ];

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Choose a category</h2>
      <p className={styles.sub}>Pick the theme for this card</p>
      <div className={styles.grid}>
        {Object.entries(categories).map(([key, cat]) => {
          const isLevelTwo = key === 'level_two';
          const isConfirming = confirmingLevel === key;
          
          return (
            <button
              key={key}
              className={`${styles.catBtn} ${isConfirming ? styles.confirming : ''}`}
              style={{ '--c': cat.color, '--g': cat.glow }}
              onClick={() => {
                if (isLevelTwo) {
                  if (isConfirming) {
                    handleLevelTwoClick();
                  } else {
                    setConfirmingLevel(key);
                    setConfirmStep(0);
                  }
                } else {
                  onSelect(key);
                }
              }}
            >
              {isConfirming ? (
                <>
                  <span className={styles.confirmEmoji}>{confirmMessages[confirmStep].emoji}</span>
                  <span className={styles.confirmText}>{confirmMessages[confirmStep].text}</span>
                  <div className={styles.confirmBtns}>
                    <button 
                      className={styles.confirmBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLevelTwoClick();
                      }}
                    >
                      {confirmStep === 2 ? 'Yes, bring it on! 💪' : 'Yes 😅'}
                    </button>
                    <button 
                      className={styles.cancelBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                    >
                      No, I'm scared 🙈
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.icon}>{cat.label.split(' ')[0]}</span>
                  <span className={styles.name}>{cat.label.split(' ').slice(1).join(' ')}</span>
                  {isLevelTwo && <span className={styles.warningIcon}>⚠️</span>}
                  <div className={styles.shine} />
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
