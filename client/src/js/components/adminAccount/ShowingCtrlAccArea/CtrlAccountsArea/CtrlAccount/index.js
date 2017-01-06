import React from 'react'

import {NameArea} from './NameArea'
import {ImageArea} from './ImageArea'
import {ButtonsArea} from './ButtonsArea/index';

export const CtrlAccount =
  ({username, onDeleteAccount, ...props}) => (
    <div className="control-account">
      <ImageArea value={props.image}/>
      <NameArea value={username}/>
      <ButtonsArea onDeleteAcc={() => onDeleteAccount(username)}/>
    </div>
  );


