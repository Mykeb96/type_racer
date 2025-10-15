
import './styles/App.css';

import { useState, useEffect, useRef } from 'react';

interface gameState {
  roundStarted: boolean,
  gameComplete: boolean
};

const initialGameState: gameState = {
  roundStarted: false,
  gameComplete: false
};

// const initialParagraph: string = `The quick brown fox wasn't just fast - it was clever. As it darted through the forest, leaves scattered beneath its paws. Each step echoed with purpose, every motion a blur of focus and grace. To chase it was to test your own limits.`;
const initialParagraph: string = `The quick brown fox`;

function App() {
  const [gameState, setGameState] = useState<gameState>(initialGameState);
  const [paragraph] = useState<string>(initialParagraph);
  const [userInput, setUserInput] = useState<string>('');
  const [clock, setClock] = useState<number>(5);
  const timerRef = useRef<number | null>(null);

  const handleInput = (event: any) => {
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
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const completeGame = (event: any) => {
    if (event.code == "Enter") {
      if (userInput === paragraph) {
        // stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setGameState(initialGameState);
        console.log(`Time taken: ${clock.toFixed(2)} seconds`);
      }
    }
  }

  const resetGame = () => {
    setUserInput('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setClock(5);
  }

  const startCountDown = () => {
    for (let i = 5; i > 0; i--) {
      setTimeout(() => {
        setClock(prevClock => prevClock - 1);
      }, (5 - i) * 1000);
    }
  }

  const startTimer = () => {
    setTimeout(() => {
      const startTime = Date.now();
        setGameState({
          roundStarted: true,
          gameComplete: false,
        });
        setClock(0);
      
      // Update timer every 10ms
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setClock(Math.floor(elapsed * 100) / 100);
      }, 10);
    }, 4000);
  }

  const startGame = () => {
    resetGame();
    startCountDown();
    startTimer();
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [])

  return (
    <div id="App">
      <div id="Container">
        <div className="Paragraph_Container">
          <p className="Paragraph_Text">{renderHighlightedText()}</p>
        </div>
        <div className="Input_Container">
          <input 
          readOnly={!gameState.roundStarted} 
          onChange={(event: any) => handleInput(event)} 
          type="text" 
          className="User_Input"
          onKeyDown={(event: any) => completeGame(event)}
          value={userInput}
          />
        </div>
        {!gameState.roundStarted ?
          <button onClick={startGame} className="Start_Button">Start</button>
        :
          <div className="Placeholder" />
        }
         {!gameState.roundStarted ? 
           <span className='Clock'>{clock}</span>
         :
           <span className='Clock'>Timer: {clock.toFixed(2)}</span>
         }
      </div>
    </div>
  )
}

export default App
