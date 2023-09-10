import React, { useState } from 'react';
import HexToUuidDisplay from './HexToUuidDisplay';

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
    <div className="heading"><p>
	Do not paste sensitive uuids into random websites you don't trust.</p>
      <label htmlFor="hex-input">Hex value from your favourite UUID provider</label>
      <input id="hex-input" type="text" value={hex} onChange={handleHexChange} />
    </div> 
  );
}

interface HexToUuidConverterProps {
  hex: string;
}

export function HexToUuidConverter(props: HexToUuidConverterProps) {
  const strippedHex = props.hex.replace(/-/g, '');

  const uuid = hexToUuid(strippedHex.substring(0, 32));

  const uuidString = uuid.toString();
  return (
    <HexToUuidDisplay uuid={uuidString} />
  );
}

export default HexToUuidConverter;
