import { useState, useRef } from 'react';
import ParticleField from './ParticleField';
import styles from './Card3D.module.css';

export default function Card3D({ card, category, playerName, onNext, onBack }) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (flipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 12, y: dx * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const depthColors = {
    light: '#22c55e',
    medium: '#f59e0b',
    deep: '#ef4444',
  };
  const depthLabel = { light: 'Light', medium: 'Medium', deep: 'Deep' };

  return (
    <div className={styles.scene}>
      <div
        ref={cardRef}
        className={`${styles.cardWrap} ${flipped ? styles.flipped : ''}`}
        style={{
          transform: flipped
            ? 'perspective(900px) rotateY(180deg)'
            : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0px)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => !flipped && setFlipped(true)}
      >
        {/* FRONT */}
        <div
          className={styles.face}
          style={{ '--glow': category.glow, '--cat-color': category.color }}
        >
          <ParticleField color={category.glow} active={false} />
          <div className={styles.frontInner}>
            <div className={styles.catBadge} style={{ background: category.color }}>
              {category.label}
            </div>
            <div className={styles.cardBack}>
              <div className={styles.logoMark}>💑</div>
              <p className={styles.tapHint}>Tap to reveal your card</p>
              <p className={styles.playerTag}>{playerName}'s turn</p>
            </div>
            <div className={styles.cornerDeco} />
          </div>
        </div>

        {/* BACK */}
        <div
          className={`${styles.face} ${styles.faceBack}`}
          style={{ '--glow': category.glow, '--cat-color': category.color }}
        >
          <ParticleField color={category.glow} active={flipped} />
          <div className={styles.backInner}>
            <div className={styles.topRow}>
              <span className={styles.catBadge} style={{ background: category.color }}>
                {category.label}
              </span>
              <span
                className={styles.depthDot}
                style={{ background: depthColors[card.depth] }}
                title={`Depth: ${depthLabel[card.depth]}`}
              >
                {depthLabel[card.depth]}
              </span>
            </div>

            <div className={styles.questionWrap}>
              <p className={styles.question}>{card.question}</p>
              {card.prompt && (
                <p className={styles.prompt}>✦ {card.prompt}</p>
              )}
            </div>

            {!answered ? (
              <button
                className={styles.answerBtn}
                type="button"
                style={{ '--glow': category.glow }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setAnswered(true); }}
              >
                ✓ I answered this
              </button>
            ) : (
              <div className={styles.answeredRow}>
                <span className={styles.answeredBadge}>✓ Answered!</span>
                <button
                  className={styles.nextBtn}
                  style={{ '--cat-color': category.color }}
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                >
                  Next Card →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.shadowBase} style={{ '--glow': category.glow }} />
    </div>
  );
}
