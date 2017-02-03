import React from 'react';

import {HeaderArea} from './HeaderArea';
import {ImageArea} from './ImageArea';
import {ButtonsArea} from './ButtonsArea/index';

export const ControlArea =
  ({username, image, onShowStatus, onShowPermission, onDeleteAcc, bubbled}) => (
    <div className={"control-area" + (bubbled ? " bubbled" : "")}>
      <ImageArea image={image}/>
      <HeaderArea name={username}/>
      <ButtonsArea onDeleteAcc={() => onDeleteAcc(username)}
                   onShowStatus={onShowStatus}
                   onShowPermission={onShowPermission}
      />
    </div>
  );
