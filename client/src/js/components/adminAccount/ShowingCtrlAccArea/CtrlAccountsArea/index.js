import React from 'react'

import {CtrlAccount} from './CtrlAccount/index'

export const CtrlAccountsArea = ({accounts, ...props}) => (
  <div className="control-accounts-wrapper">
    {accounts.length > 0 ?
      accounts.map(entry =>
        <CtrlAccount
          key={entry.username}
          {...entry}
          {...props}
        />)
      :
      <p>Нет созданных аккаунтов</p>
    }
  </div>
);
