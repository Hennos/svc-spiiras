import React from 'react'

import {CtrlAccount} from './CtrlAccount'

export const ShowingCtrlAccArea = ({admined}) => (
  <div className="admined_user">
    {admined.length > 0 ?
      admined.map(entry => <CtrlAccount key={entry.username} {...entry}/>)
      :
      <p>У вас пока нет контролируемых аккаунтов</p>
    }
  </div>
);
