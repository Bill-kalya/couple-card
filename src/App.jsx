import { useState } from 'react';
import data from './cards.json';
import Card3D from './Card3D';
import CategoryPicker from './CategoryPicker';
import styles from './App.module.css';

const PHASES = {
  SETUP: 'setup',
  CATEGORY: 'category',
  CARD: 'card',
  SWITCH: 'switch',
  SCORE: 'score',
};

export default function App() {
  const [phase, setPhase] = useState(PHASES.SETUP);
  const [players, setPlayers] = useState({ p1: '', p2: '' });
  const [input, setInput] = useState({ p1: '', p2: '' });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedCat, setSelectedCat] = useState(null);
  const [deck, setDeck] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState([]);

  const categories = data.categories;
  const currentPlayerKey = currentPlayer === 1 ? 'p1' : 'p2';
  const currentPlayerName = players[currentPlayerKey];

  const handleSetup = () => {
    if (!input.p1.trim() || !input.p2.trim()) return;
    setPlayers({ p1: input.p1.trim(), p2: input.p2.trim() });
    setPhase(PHASES.CATEGORY);
  };

  const handleCategorySelect = (catKey) => {
    setSelectedCat(catKey);
    const cards = [...categories[catKey].cards].sort(() => Math.random() - 0.5);
    setDeck(cards);
    setCardIndex(0);
    setPhase(PHASES.CARD);
  };

  const handleNext = () => {
    setScores(prev => ({ ...prev, [currentPlayerKey]: prev[currentPlayerKey] + 1 }));
    setHistory(prev => [...prev, { player: currentPlayerName, cat: selectedCat, card: deck[cardIndex] }]);
    
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);
    setRound(r => r + 1);
    if (round % 4 === 0) {
      setPhase(PHASES.SWITCH);
    } else {
      const nextIdx = (cardIndex + 1) % deck.length;
      setCardIndex(nextIdx);
      setPhase(PHASES.CARD);
    }
  };

  const handleContinue = () => {
    if (round > 16) {
      setPhase(PHASES.SCORE);
    } else {
      setPhase(PHASES.CATEGORY);
    }
  };

  const handleRestart = () => {
    setPhase(PHASES.SETUP);
    setPlayers({ p1: '', p2: '' });
    setInput({ p1: '', p2: '' });
    setCurrentPlayer(1);
    setSelectedCat(null);
    setDeck([]);
    setCardIndex(0);
    setScores({ p1: 0, p2: 0 });
    setRound(1);
    setHistory([]);
  };

  const currentCard = deck[cardIndex];
  const currentCategory = selectedCat ? categories[selectedCat] : null;

  return (
    <div className={styles.app}>
      <div
        className={styles.ambientGlow}
        style={{ background: currentCategory
          ? `radial-gradient(ellipse 60% 50% at 50% 50%, ${currentCategory.glow}18 0%, transparent 70%)`
          : 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232, 94, 157, 0.14) 0%, transparent 70%)'
        }}
      />

      <header className={styles.header}>
        <span className={styles.logo}>💑 <span>Us Cards</span></span>
        {phase !== PHASES.SETUP && (
          <div className={styles.scoreBar}>
            <span className={styles.scoreItem}>
              <span className={styles.scoreName}>{players.p1}</span>
              <span className={styles.scoreNum}>{scores.p1}</span>
            </span>
            <span className={styles.roundBadge}>R{round}</span>
            <span className={styles.scoreItem}>
              <span className={styles.scoreNum}>{scores.p2}</span>
              <span className={styles.scoreName}>{players.p2}</span>
            </span>
          </div>
        )}
      </header>

      <main className={styles.main}>

        {phase === PHASES.SETUP && (
          <div className={styles.setupWrap}>
            <div className={styles.setupCard}>
              <h1 className={styles.setupTitle}>Us Cards</h1>
              <p className={styles.setupSub}>A card game for two people ready to go deeper.</p>
              <div className={styles.inputGroup}>
                <label>Player 1</label>
                <input
                  className={styles.nameInput}
                  placeholder="Your name..."
                  value={input.p1}
                  onChange={e => setInput(p => ({ ...p, p1: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleSetup()}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Player 2</label>
                <input
                  className={styles.nameInput}
                  placeholder="Partner's name..."
                  value={input.p2}
                  onChange={e => setInput(p => ({ ...p, p2: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleSetup()}
                />
              </div>
              <button
                className={styles.startBtn}
                onClick={handleSetup}
                disabled={!input.p1.trim() || !input.p2.trim()}
              >
                Begin the Game ✦
              </button>
              <p className={styles.disclaimer}>A safe space for honest conversations.</p>
            </div>
          </div>
        )}

        {phase === PHASES.CATEGORY && (
          <div className={styles.phaseWrap}>
            <p className={styles.turnLabel}>
              <span className={styles.turnName}>{currentPlayerName}</span> — pick a category
            </p>
            <CategoryPicker 
              categories={categories} 
              onSelect={handleCategorySelect} 
            />
          </div>
        )}

        {phase === PHASES.CARD && currentCard && currentCategory && (
          <div className={styles.phaseWrap}>
            <p className={styles.turnLabel}>
              <span className={styles.turnName}>{currentPlayerName}</span>'s card
            </p>
            <Card3D
              key={`${selectedCat}-${cardIndex}-${round}`}
              card={currentCard}
              category={currentCategory}
              playerName={currentPlayerName}
              onNext={handleNext}
            />
          </div>
        )}

        {phase === PHASES.SWITCH && (
          <div className={styles.switchWrap}>
            <div className={styles.switchCard}>
              <div className={styles.switchEmoji}>🔄</div>
              <h2 className={styles.switchTitle}>Checkpoint!</h2>
              <p className={styles.switchSub}>Take a breath. Check in with each other.</p>
              <div className={styles.switchScores}>
                <div className={styles.switchScore}>
                  <span className={styles.switchName}>{players.p1}</span>
                  <span className={styles.switchNum}>{scores.p1}</span>
                </div>
                <div className={styles.switchDivider}>vs</div>
                <div className={styles.switchScore}>
                  <span className={styles.switchName}>{players.p2}</span>
                  <span className={styles.switchNum}>{scores.p2}</span>
                </div>
              </div>
              <div className={styles.switchBtns}>
                <button className={styles.continueBtn} onClick={handleContinue}>Keep Going →</button>
                <button className={styles.endBtn} onClick={() => setPhase(PHASES.SCORE)}>End Game</button>
              </div>
            </div>
          </div>
        )}

        {phase === PHASES.SCORE && (
          <div className={styles.scoreWrap}>
            <div className={styles.scoreCard}>
              <div className={styles.scoreEmoji}>✨</div>
              <h2 className={styles.scoreTitle}>You did it.</h2>
              <p className={styles.scoreSub}>{scores.p1 + scores.p2} cards answered together.</p>
              <div className={styles.finalScores}>
                <div className={`${styles.finalScore} ${scores.p1 >= scores.p2 ? styles.winner : ''}`}>
                  <span className={styles.finalName}>{players.p1}</span>
                  <span className={styles.finalNum}>{scores.p1}</span>
                  {scores.p1 > scores.p2 && <span className={styles.crown}>👑</span>}
                </div>
                <div className={`${styles.finalScore} ${scores.p2 >= scores.p1 ? styles.winner : ''}`}>
                  <span className={styles.finalName}>{players.p2}</span>
                  <span className={styles.finalNum}>{scores.p2}</span>
                  {scores.p2 > scores.p1 && <span className={styles.crown}>👑</span>}
                </div>
              </div>
              {scores.p1 === scores.p2 && <p className={styles.tieMsg}>🤝 A tie — the real win is the connection.</p>}
              <div className={styles.historyWrap}>
                <p className={styles.historyTitle}>Your Journey</p>
                <div className={styles.historyList}>
                  {history.slice(-5).map((h, i) => (
                    <div key={i} className={styles.historyItem} style={{ borderLeftColor: categories[h.cat]?.color }}>
                      <span className={styles.historyPlayer}>{h.player}</span>
                      <span className={styles.historyQ}>{h.card.question.slice(0, 55)}…</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className={styles.restartBtn} onClick={handleRestart}>Play Again 💑</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
