import React from 'react';

import {NameArea} from './NameArea';
import {ImageArea} from './ImageArea';
import {ButtonsArea} from './ButtonsArea/index';

export const CtrlAccount = ({username, image, onDeleteAccount}) => (
    <div className="control-account">
      <ImageArea image={image}/>
      <NameArea name={username}/>
      <ButtonsArea onDeleteAcc={() => onDeleteAccount(username)}/>
    </div>
  );
