
import './styles/App.css';

import { useState, useEffect } from 'react';

interface gameState {
  roundStarted: boolean,
  onTrack: boolean
}

const initialGameState: gameState = {
  roundStarted: true,
  onTrack: true
}

const initialParagraph: string = `The quick brown fox wasn't just fast - it was clever. As it darted through the forest, leaves scattered beneath its paws. Each step echoed with purpose, every motion a blur of focus and grace. To chase it was to test your own limits.`;

function App() {
  const [gameState, setGameState] = useState<gameState>(initialGameState);
  const [paragraph, setParagraph] = useState<string>(initialParagraph);
  const [userInput, setUserInput] = useState<string>('')

  const handleInput = (e: any) => {
    setUserInput(e.target.value)
  }

  useEffect(() => {
    if (gameState.roundStarted) {
      let paragraphSubStr = paragraph.substr(0, userInput.length);
      if (userInput === paragraphSubStr) {
        console.log('good')
      } else {
        console.log('bad')
      }
    }
  }, [userInput])

  return (
    <div id="App">
      <div id="Container">
        <div className="Paragraph_Container">
          <p className="Paragraph_Text">{paragraph}</p>
        </div>

        <div className="Input_Container">
          <input disabled={!gameState.roundStarted} onChange={(e: any) => handleInput(e)} type="text" className="User_Input"/>
        </div>
      </div>
    </div>
  )
}

export default App
