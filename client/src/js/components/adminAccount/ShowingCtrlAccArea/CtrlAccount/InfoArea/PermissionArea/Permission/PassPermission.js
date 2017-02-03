import React from 'react';

import {BasePermission} from './BasePermission/index'

const Input = ({name, onChange}) => (
  <div className="input_block">
    <input
      type="text" name={name}
      onChange={(event) => onChange(name, event.target.value)}
    />
  </div>
);

export const PassPermission = ({title, name, value, onChange}) => (
  <div className="pass-permission-area">
    <BasePermission
      title={title} name={name} value={value}
      onChange={onChange}
    />
    {value && <Input name={name} onChange={onChange}/>}
  </div>
);
