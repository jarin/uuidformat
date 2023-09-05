import React, { useState } from 'react';
import {HexToUuidInput,HexToUuidConverter} from './comp';

function App() {
  const [hex, setHex] = useState('');

  function handleHexChange(newHex: string) {
    setHex(newHex);
  }

  return (
    
    <div className="App">
      <header className="App-header">
        
        <HexToUuidInput onHexChange={handleHexChange} />
        {hex && <HexToUuidConverter hex={hex} />}
      </header>
    </div>
  );
}

export default App;