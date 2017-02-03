import React from 'react';

import {Name} from './Name';
import {Status} from './Status';
import {Input} from './Input';

const Header = ({title, curValue}) => (
  <div className="elem-area">
    <Name title={title}/>
    <Status value={curValue}/>
  </div>
);

export const Email = ({value, onChange}) => (
  <div className="elem-input">
    <Header title="Email" curValue={value}/>
    <Input name="email" onChange={onChange}/>
  </div>
);
