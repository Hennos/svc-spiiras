import React from 'react';

import {Name} from './Name';
import {Status} from './Status';

export const Element = ({title, value}) => (
  <div className="elem-area">
    <Name title={title}/>
    <Status value={value}/>
  </div>
);
