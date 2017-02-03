import React from 'react';

import {Email} from './Element/Email';
import {Password} from './Element/Password';

export const StatusWrapper = ({value, onChange}) => (
  <div className="info-elements-wrapper">
    <Email value={value.email} onChange={onChange}/>
    <Password onChange={onChange}/>
  </div>
);
