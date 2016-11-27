import React from 'react'

import {HeaderArea} from './HeaderArea'
import {FormArea} from './FormArea/index'

export const CreationCtrlAccArea = (props) => (
    <div className="adminAccount-area_wrapper">
      <HeaderArea title="Административные настройки пользователя"/>
      <FormArea {...props}/>
    </div>
  );
