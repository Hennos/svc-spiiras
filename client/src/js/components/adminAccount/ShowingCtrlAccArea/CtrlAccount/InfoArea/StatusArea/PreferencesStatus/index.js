import React from 'react';

import {HeaderArea} from './HeaderArea';
import {StatusWrapper} from './StatusWrapper';

export const PreferencesStatus = ({value, onChange}) => (
  <div className="preferences-block status-block">
    <HeaderArea title="Дополнительные данные"/>
    <StatusWrapper value={value} onChange={onChange}/>
  </div>
);
