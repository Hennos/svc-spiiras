import React from 'react'

import {SetPermissionHeader} from './SetPermissionHeader'
import {PermissionWrapper} from './PermissionWrapper'

export const SetPermissionArea = ({onChange}) => (
  <div className="set-permission-wrapper">
    <SetPermissionHeader title="Разрешения:"/>
    <PermissionWrapper onChange={onChange}/>
  </div>
);
