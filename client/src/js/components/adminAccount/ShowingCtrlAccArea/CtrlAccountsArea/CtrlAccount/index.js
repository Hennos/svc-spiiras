import React from 'react'

import {NameArea} from './NameArea'
import {ImageArea} from './ImageArea'
import {DeleteAccButton} from './DeleteAccButton'

export const CtrlAccount =
  ({username, onDeleteAccount, ...props}) => (
    <div className="control-account">
      <ImageArea value={props.image}/>
      <NameArea value={username}/>
      <DeleteAccButton onClick={() => onDeleteAccount(username)}/>
    </div>
  );


