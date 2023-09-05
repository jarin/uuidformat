import React, { useState } from 'react';
import { validate as uuidparse } from 'uuid';
import { v4 } from 'uuid';
import { ReactComponent as MyIcon } from './copy-icon.svg';

function hexToUuid(hex: string): string {
    const group1 = hex.substring(0, 8);
    const group2 = hex.substring(8, 12);
    const group3 = hex.substring(12, 16);
    const group4 = hex.substring(16, 20);
    const group5 = hex.substring(20);
  
    const uuid = `${group1}-${group2}-${group3}-${group4}-${group5}`;
    return uuid;
  }

interface HexToUuidInputProps {
  onHexChange: (hex: string) => void;
}

export function HexToUuidInput(props: HexToUuidInputProps) {
  const [hex, setHex] = useState('');

  function handleHexChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newHex = event.target.value;
    setHex(newHex);
    props.onHexChange(newHex);
  }

  return (
    <div className="heading">
      <label htmlFor="hex-input">32digit hex:</label>
      <input id="hex-input" type="text" value={hex} onChange={handleHexChange} />
    </div> 
  );
}

interface HexToUuidConverterProps {
  hex: string;
}

export function HexToUuidConverter(props: HexToUuidConverterProps) {
  const strippedHex = props.hex.replace(/-/g, '');

  const uuid = hexToUuid(strippedHex.substring(0, 31));
  const uuidString = uuid.toString();
  return (
    <HexToUuidDisplay uuid={uuidString} />
  );
}

interface HexToUuidDisplayProps {
  uuid: string;
}
function isValidUUID(uuid: string) {
    try {
        console.log(uuid);
        const p =  uuidparse(uuid);
        return true;


    }
    catch (err) {
      console.log("err",err);
        return false;
    }
}
export function HexToUuidDisplay(props: HexToUuidDisplayProps) {
    const [copySuccess, setCopySuccess] = useState(false);

    function handleCopyClick() {
      navigator.clipboard.writeText(props.uuid)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch(() => {
        setCopySuccess(false);
      })};
 

    return (
 
 <div className="result">
      {isValidUUID(props.uuid)?props.uuid:'Invalid'}
      <button onClick={handleCopyClick}>
       <MyIcon className="icon" />
        
      </button>
      {copySuccess && <span className="copied">Copied!</span>}
    </div>
  );
}