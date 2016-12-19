import React from 'react';

import {Header} from './Header'
import {Checkbox} from './Checkbox'

export const BasePermission = ({title, name, onChange}) => (
  <div className="base-permission-area">
    <Header title={title}/>
    <Checkbox name={name} onChange={onChange}/>
  </div>
);
