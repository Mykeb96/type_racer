import './styles/App.css';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface GameState {
  roundStarted: boolean;
  gameComplete: boolean;
}

const initialGameState: GameState = {
  roundStarted: false,
  gameComplete: false,
};

const PROMPTS: string[] = [
  `The quick brown fox wasn't just fast - it was clever. As it darted through the forest, leaves scattered beneath its paws. Each step echoed with purpose, every motion a blur of focus and grace. To chase it was to test your own limits.`,
  `Neon rain traced the skyline while the city hummed below. Somewhere between signal and noise, a quiet idea waited to be typed into existence. Precision beats speed when every character counts.`,
  `Coffee cooled beside the keyboard as lines of logic took shape. Bugs hid in the margins of confidence, but patience and a sharp eye turned chaos into something that finally ran clean.`,
  `The harbor fog lifted slowly, revealing masts and distant bells. Sailors measured time in ropes and tides; here we measure it in keystrokes and breath held until the finish line.`,
  `A single typo can change the tone of a message. The best typists treat rhythm like music: steady tempo, clean releases, and the satisfaction of a passage completed without looking back.`,
];

function pickRandomPrompt(exclude?: string): string {
  const pool = exclude ? PROMPTS.filter((p) => p !== exclude) : PROMPTS;
  if (pool.length === 0) return PROMPTS[0];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [paragraph, setParagraph] = useState<string>(() => pickRandomPrompt());
  const [userInput, setUserInput] = useState<string>('');
  const [clock, setClock] = useState<number>(5);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const raceStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(
    () => paragraph.trim().split(/\s+/).filter(Boolean).length,
    [paragraph],
  );

  const clearCountdown = useCallback(() => {
    countdownTimeoutsRef.current.forEach((id) => clearTimeout(id));
    countdownTimeoutsRef.current = [];
  }, []);

  const clearRaceStartTimeout = useCallback(() => {
    if (raceStartTimeoutRef.current !== null) {
      clearTimeout(raceStartTimeoutRef.current);
      raceStartTimeoutRef.current = null;
    }
  }, []);

  const stopTickTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishRace = useCallback(() => {
    stopTickTimer();
    setGameState({
      roundStarted: false,
      gameComplete: true,
    });
  }, [stopTickTimer]);

  const resetGame = useCallback(() => {
    stopTickTimer();
    clearCountdown();
    clearRaceStartTimeout();
    setUserInput('');
    setClock(5);
    setGameState(initialGameState);
  }, [stopTickTimer, clearCountdown, clearRaceStartTimeout]);

  const handleNewPrompt = useCallback(() => {
    resetGame();
    setParagraph((prev) => pickRandomPrompt(prev));
  }, [resetGame]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const renderHighlightedText = () => {
    const characters = paragraph.split('');
    const userInputChars = userInput.split('');

    return characters.map((char, index) => {
      let className = 'char';

      if (index < userInputChars.length) {
        if (char === userInputChars[index]) {
          className += ' correct';
        } else {
          className += ' incorrect';
        }
      } else if (index === userInputChars.length && gameState.roundStarted && !gameState.gameComplete) {
        className += ' next';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const startCountDown = useCallback(() => {
    clearCountdown();
    for (let i = 5; i > 0; i--) {
      const id = window.setTimeout(() => {
        setClock((prev) => prev - 1);
      }, (5 - i) * 1000);
      countdownTimeoutsRef.current.push(id);
    }
  }, [clearCountdown]);

  const startTimer = useCallback(() => {
    clearRaceStartTimeout();
    raceStartTimeoutRef.current = window.setTimeout(() => {
      raceStartTimeoutRef.current = null;
      const startTime = Date.now();
      setGameState({
        roundStarted: true,
        gameComplete: false,
      });
      setClock(0);

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setClock(Math.floor(elapsed * 100) / 100);
      }, 10);
    }, 4000);
  }, [clearRaceStartTimeout]);

  const startGame = () => {
    resetGame();
    startCountDown();
    startTimer();
  };

  useEffect(() => {
    if (
      gameState.roundStarted &&
      !gameState.gameComplete &&
      paragraph.length > 0 &&
      userInput === paragraph
    ) {
      finishRace();
    }
  }, [userInput, paragraph, gameState.roundStarted, gameState.gameComplete, finishRace]);

  useEffect(() => {
    if (gameState.roundStarted && !gameState.gameComplete) {
      inputRef.current?.focus();
    }
  }, [gameState.roundStarted, gameState.gameComplete]);

  useEffect(() => {
    return () => {
      stopTickTimer();
      clearCountdown();
      clearRaceStartTimeout();
    };
  }, [stopTickTimer, clearCountdown, clearRaceStartTimeout]);

  const showCountdown = !gameState.roundStarted && !gameState.gameComplete;
  const wpm =
    gameState.gameComplete && clock > 0 ? Math.round((wordCount / clock) * 60) : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <h1 className="brand-title">Type Racer</h1>
          <p className="brand-tagline">Clean rhythm. Sharp focus. One passage at a time.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-ghost" onClick={handleNewPrompt}>
            New prompt
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="race-card">
          <div className="stats-row">
            <div className="stat">
              <span className="stat-label">Timer</span>
              <span className={`stat-value ${showCountdown ? 'stat-value--muted' : ''}`}>
                {showCountdown ? clock : `${clock.toFixed(2)}s`}
              </span>
            </div>
            {wpm !== null && (
              <div className="stat">
                <span className="stat-label">WPM</span>
                <span className="stat-value stat-value--success">{wpm}</span>
              </div>
            )}
            <div className="stat">
              <span className="stat-label">Words</span>
              <span className="stat-value stat-value--muted">{wordCount}</span>
            </div>
          </div>

          <div className="paragraph-wrap">
            <p className="paragraph-text">{renderHighlightedText()}</p>
          </div>

          <div className="input-wrap">
            <input
              ref={inputRef}
              readOnly={!gameState.roundStarted}
              onChange={handleInput}
              type="text"
              className="user-input"
              value={userInput}
              placeholder={gameState.roundStarted ? 'Type the passage…' : 'Press Start when ready'}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Typing input"
            />
          </div>

          <div className="actions-row">
            {!gameState.roundStarted && !gameState.gameComplete && (
              <button type="button" className="btn btn-primary" onClick={startGame}>
                Start race
              </button>
            )}
            {gameState.gameComplete && (
              <button type="button" className="btn btn-primary" onClick={startGame}>
                Race again
              </button>
            )}
          </div>

          {gameState.roundStarted && !gameState.gameComplete && (
            <p className="hint">Typing the last character ends the run automatically — stay accurate.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
