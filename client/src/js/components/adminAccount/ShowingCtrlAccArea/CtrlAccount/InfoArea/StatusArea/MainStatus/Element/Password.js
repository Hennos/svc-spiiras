import React from 'react';

import {Name} from './Name';
import {Input} from './Input';

const Header = ({title}) => (
  <div className="elem-area">
    <Name title={title}/>
  </div>
);

export const Password = ({onChange}) => (
  <div className="main-status-area">
    <Header title="Пароль"/>
    <Input name="password" onChange={onChange}/>
  </div>
);
