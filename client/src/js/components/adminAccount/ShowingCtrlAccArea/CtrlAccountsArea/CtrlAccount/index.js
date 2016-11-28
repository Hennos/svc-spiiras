import React from 'react'

import {NameArea} from './NameArea'
import {ImageArea} from './ImageArea'
import {DeleteAccButton} from './DeleteAccButton'

export const CtrlAccount = (props) => (
  <div className="control-account">
    <ImageArea value={props.image}/>
    <NameArea value={props.username}/>
    <DeleteAccButton onClick={props.deleteCtrlAccount}/>
  </div>
);
