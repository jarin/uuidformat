import React, { useState } from 'react';
import HexToUuidDisplay from './HexToUuidDisplay';
import { isValidUUID } from './utils';

interface HexToUuidConverterProps {
  hex: string;
  uuid: string;
  onGenerateUuid: () => void;
}

export function HexToUuidConverter(props: HexToUuidConverterProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  function handleCopyClick(text: string) {
    navigator.clipboard.writeText(text)
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

  const classResult = `result ${isValidUUID(props.uuid) ? 'valid' : 'invalid'}`;

  return (
    <div className={classResult}>
      <HexToUuidDisplay uuid={props.uuid} />
      {copySuccess && <div className="floating-box">Copied!</div>}

      <button 
        onClick={props.onGenerateUuid} 
        style={{ 
          padding: '10px 20px', 
          margin: '10px 0', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        Generate Random UUID
      </button>
    </div>
  );
}
