import React, { useState } from 'react';
import HexToUuidDisplay from './HexToUuidDisplay';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid package
import { ReactComponent as MyIcon } from './copy-icon.svg';
export function hexToUuid(hex: string): string {
  const group1 = hex.substring(0, 8);
  const group2 = hex.substring(8, 12);
  const group3 = hex.substring(12, 16);
  const group4 = hex.substring(16, 20);
  const group5 = hex.substring(20);

  const uuid = `${group1}-${group2}-${group3}-${group4}-${group5}`;
  return uuid;
}

export function uuidToHex(uuid: string): string {
  return uuid.replace(/-/g, '');
}

interface HexToUuidInputProps {
  onHexChange: (hex: string) => void;
  onUuidChange: (uuid: string) => void;
  hex: string;
  uuid: string;
}

export function HexToUuidInput(props: HexToUuidInputProps) {
  function handleHexChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newHex = event.target.value;
    props.onHexChange(newHex);
  }

  function handleUuidChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newUuid = event.target.value;
    props.onUuidChange(newUuid);
  }

  return (
    <div>
      <p>Do not paste sensitive UUIDs into random websites you don't trust.</p>
      <label htmlFor="hex-input">Hex value from your favourite UUID provider</label>
      <input id="hex-input" type="text" value={props.hex} onChange={handleHexChange}     style={{ 
          width: '80%', 
          padding: '10px', 
          margin: '10px 0', 
          fontSize: '2em' 
        }} 
      /><br/>
      <label htmlFor="uuid-input">UUID value</label>
      <input id="uuid-input" type="text" value={props.uuid} onChange={handleUuidChange}     style={{ 
          
          width: '80%', 
          padding: '10px', 
          margin: '10px 0', 
          fontSize: '2em' 
        }} 
      />
    </div>
  );
}

interface HexToUuidConverterProps {
  hex: string;
  uuid: string;
  onGenerateUuid: () => void;
}

export function HexToUuidConverter(props: HexToUuidConverterProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  function handleCopyUuidClick() {
    navigator.clipboard.writeText(props.uuid)
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

  function handleCopyHexClick() {
    navigator.clipboard.writeText(props.hex)
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
    <div>
      <HexToUuidDisplay uuid={props.uuid} /> 
      <div>
        UUID: {props.uuid}
        <button onClick={handleCopyUuidClick}>
          <MyIcon className="icon" />
        </button>
      </div>
      <div>
        Hex: {props.hex}
        <button onClick={handleCopyHexClick}>
          <MyIcon className="icon" />
        </button>
      </div>
      {copySuccess && <span className="copied">Copied!</span>}
      <button onClick={props.onGenerateUuid} style={{ 
          padding: '10px 20px', 
          margin: '10px 0', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      > Generate Random UUID </button>
      
    </div>
  );
}

 