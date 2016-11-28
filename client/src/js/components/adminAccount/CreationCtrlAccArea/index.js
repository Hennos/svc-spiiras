import React from 'react'

import {HeaderArea} from './HeaderArea'
import {FormArea} from './FormArea/index'

export const CreationCtrlAccArea = (props) => (
    <div className="account-creating_wrapper">
      <HeaderArea title="Создание нового аккаунта:"/>
      <FormArea {...props}/>
    </div>
  );
