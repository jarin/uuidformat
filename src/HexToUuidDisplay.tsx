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



const classResult = `result ${isValidUUID(props.uuid) ? 'valid' : 'invalid'}`;

    return (
 
 <div className={classResult}>
      {props.uuid}
       
    </div>
  );
}

export default HexToUuidDisplay
