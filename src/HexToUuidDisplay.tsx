import React, { useState } from 'react';
import {validate as uuidparse } from 'uuid';
import { ReactComponent as MyIcon } from './copy-icon.svg';




interface HexToUuidDisplayProps {
  uuid: string;
}
function isValidUUID(uuid: string) {
    try {
        return uuidparse(uuid);
    }
    catch (err) {
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
 
const classResult = `result ${isValidUUID(props.uuid) ? 'valid' : 'invalid'}`;

    return (
 
 <div className={classResult}>
      {props.uuid}
      <button onClick={handleCopyClick}>
       <MyIcon className="icon" />
        
      </button>
      {copySuccess && <span className="copied">Copied!</span>}
    </div>
  );
}

export default HexToUuidDisplay
