
import './styles/App.css';

import { useState, useEffect, useRef } from 'react';

interface gameState {
  roundStarted: boolean,
  onTrack: boolean
};

const initialGameState: gameState = {
  roundStarted: false,
  onTrack: false
};

// const initialParagraph: string = `The quick brown fox wasn't just fast - it was clever. As it darted through the forest, leaves scattered beneath its paws. Each step echoed with purpose, every motion a blur of focus and grace. To chase it was to test your own limits.`;
const initialParagraph: string = `The quick brown fox`;

function App() {
  const [gameState, setGameState] = useState<gameState>(initialGameState);
  const [paragraph] = useState<string>(initialParagraph);
  const [userInput, setUserInput] = useState<string>('');
  const [clock, setClock] = useState<number>(5);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const handleInput = (e: any) => {
    setUserInput(e.target.value);
  };

  const checkUserProgress = () => {
    let paragraphSubStr = paragraph.substr(0, userInput.length);
    if (userInput === paragraphSubStr && userInput != '') {
      if (gameState.onTrack == false) {
        setGameState({
          roundStarted: true,
          onTrack: true
        });
      }
    } else {
      if (gameState.onTrack == true) {
        setGameState({
          roundStarted: true,
          onTrack: false
        });
      }
    }
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

  const completeGame = (e: any) => {
    if (e.code == "Enter") {
      if (userInput === paragraph) {
        // stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setGameState(initialGameState);
        const finalTime = (Date.now() - (gameStartTime || Date.now())) / 1000;
        console.log('user completed the paragraph!');
        console.log(`Time taken: ${finalTime.toFixed(2)} seconds`);
      }
    }
  }

  const startGame = () => {
    // Reset everything
    setUserInput('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setClock(5);
    
    for (let i = 5; i > 0; i--) {
      setTimeout(() => {
        setClock(prevClock => prevClock - 1);
      }, (5 - i) * 1000);
    }

    setTimeout(() => {
      const startTime = Date.now();
      setGameState({
        roundStarted: true,
        onTrack: false
      });
      setClock(0);
      setGameStartTime(startTime);
      
      // Update timer every 10ms
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setClock(Math.floor(elapsed * 100) / 100);
      }, 10);
    }, 4000);
  }

  useEffect(() => {
    if (gameState.roundStarted) {
     checkUserProgress();
    }
  }, [userInput])

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
          onChange={(e: any) => handleInput(e)} 
          type="text" 
          className="User_Input"
          onKeyDown={(e: any) => completeGame(e)}
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
