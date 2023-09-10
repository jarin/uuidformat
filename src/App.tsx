import React, { useState } from 'react';

import { HexToUuidInput } from './HexToUuidInput';
import { HexToUuidConverter } from './HexToUuidInput';
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
      <div className="infobox"><h1>What's this?</h1>  
      <p>Copy a UUID from the database (typically RAW(16) from Oracle) and paste it here to get the uuid in the proper format.A UUID conforming to RFC-4122 will be slightly blue. This site is not collecting any data. Nothing leaves your browser.</p></div>
    </div>
  );
}

export default App;
