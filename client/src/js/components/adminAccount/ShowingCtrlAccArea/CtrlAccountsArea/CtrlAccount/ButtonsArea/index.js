import React from 'react';

import {Button} from './Button'

export const ButtonsArea =
  ({onShowPermission, onShowStatus, onDeleteAcc}) => {
    const arrayButtons = [{
      name: 'showAccStatus',
      view: 'fa fa-question',
      onClick: onShowStatus
    }, {
      name: 'showAccPermission',
      view: 'fa fa-unlock-alt',
      onClick: onShowPermission
    }, {
      name: 'deleteAccButton',
      view: 'fa fa-times',
      onClick: onDeleteAcc
    }];

    return (
      <div className="buttons-area">
        {arrayButtons.map(entry =>
          <Button key={entry.name} {...entry}/>
        )}
      </div>
    );
  };
