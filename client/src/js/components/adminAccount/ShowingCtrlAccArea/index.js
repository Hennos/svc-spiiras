import React from 'react'

import {HeaderArea} from './HeaderArea'
import {CtrlAccountsArea} from './CtrlAccountsArea/index'

export const ShowingCtrlAccArea = ({admined, ...props}) => (
  <div className="admined_user">
    <CtrlAccountsArea accounts={admined} />
  </div>
);
