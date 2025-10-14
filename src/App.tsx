
import './styles/App.css'

import { useState } from 'react'

const initialParagraph: string = `The quick brown fox wasn't just fast—it was clever. 
As it darted through the forest, leaves scattered beneath its paws. Each step echoed 
with purpose, every motion a blur of focus and grace. To chase it was to test your own limits.`

function App() {
  const [paragraph, setParagraph] = useState<string>(initialParagraph)

  return (
    <div id="App">
      <div className='paragraph_container'>
        {paragraph}
      </div>
    </div>
  )
}

export default App
