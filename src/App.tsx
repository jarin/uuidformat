import React, { useState } from 'react';
import { HexToUuidInput } from './HexToUuidInput';
import { HexToUuidConverter } from './HexToUuidConverter';
import { v4 as uuidv4 } from 'uuid';
import { hexToUuid, uuidToHex } from './utils';

function App() {
  const [hex, setHex] = useState('');
  const [uuid, setUuid] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  function handleHexChange(newHex: string) {
    setHex(newHex);
    setUuid(hexToUuid(newHex.substring(0, 32)));
  }

  function handleUuidChange(newUuid: string) {
    setUuid(newUuid);
    setHex(uuidToHex(newUuid));
  }

  function generateRandomUuid() {
    const newUuid = uuidv4();
    setUuid(newUuid);
    setHex(uuidToHex(newUuid));
  }
  function handleCopyHex() {
    navigator.clipboard.writeText(hex)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch(() => {
        setCopySuccess(false);
      });
  }
  
  function handleCopyUuid() {
    navigator.clipboard.writeText(uuid)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch(() => {
        setCopySuccess(false);
      });
  }
  
  
  

  return (
    <div className="App">    {copySuccess && <div className="floating-box">Copied!</div>}
      <header className="App-header">
        <HexToUuidInput 
          hex={hex} 
          uuid={uuid} 
          onHexChange={handleHexChange} 
          onUuidChange={handleUuidChange} 
          onCopyHex={handleCopyHex}
          onCopyUuid={handleCopyUuid}
        />
         
        <HexToUuidConverter hex={hex} uuid={uuid} onGenerateUuid={generateRandomUuid} />
      </header>
      <div className="infobox">
        <h1>What's this?</h1>
        <p>Copy a UUID from the database (typically RAW(16) from Oracle) and paste it here to get the UUID in the proper format. A UUID conforming to RFC-4122 will be slightly blue. This site is not collecting any data. Nothing leaves your browser.</p>
      </div>
    </div>
  );
}

export default App;
