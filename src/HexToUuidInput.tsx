import React from 'react';
import { ReactComponent as MyIcon } from './copy-icon.svg';

interface HexToUuidInputProps {
  onHexChange: (hex: string) => void;
  onUuidChange: (uuid: string) => void;
  hex: string;
  uuid: string;
  onCopyHex: () => void;
  onCopyUuid: () => void;
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
    <div className="input-container">
      <div className="input-group">
        <label htmlFor="hex-input">Hex value from your favourite UUID provider</label>
        <div className="input-with-icon">
          <input 
            size={36}
            id="hex-input" 
            type="text" 
            value={props.hex} 
            onChange={handleHexChange} 
          />
          <button onClick={props.onCopyHex}>
            <MyIcon className="icon" />
          </button>
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="uuid-input">UUID value in the proper format for normal people</label>
        <div className="input-with-icon">
          <input 
            size={36}
            id="uuid-input" 
            type="text" 
            value={props.uuid} 
            onChange={handleUuidChange} 
          />
          <button onClick={props.onCopyUuid}>
            <MyIcon className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
