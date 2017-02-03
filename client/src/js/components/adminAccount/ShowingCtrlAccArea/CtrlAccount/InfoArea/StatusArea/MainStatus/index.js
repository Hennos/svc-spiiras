import React from 'react'

import {HeaderArea} from './HeaderArea';
import {StatusWrapper} from './StatusWrapper';

export const MainStatus = ({value, onChange}) => (
  <div className="main-status-block status-block">
    <HeaderArea title="Основной статус"/>
    <StatusWrapper value={value} onChange={onChange}/>
  </div>
);
