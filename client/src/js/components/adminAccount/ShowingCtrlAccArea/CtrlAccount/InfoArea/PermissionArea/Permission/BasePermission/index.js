import React from 'react';

import {Name} from './Name';
import {Checkbox} from './Checkbox';

export const BasePermission = ({title, name, value, onChange}) => (
  <div className="elem-area">
    <Name title={title}/>
    <Checkbox name={name} value={value} onChange={onChange}/>
  </div>
);
