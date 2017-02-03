import React from 'react';

import StatusArea from './StatusArea/index';
import PermissionArea from './PermissionArea/index';

const FLAGS = {
  TYPE_AREA: {
    STATUS: 1,
    PERMISSION: 2
  }
};
const areaMap = new Map([
  [FLAGS.TYPE_AREA.STATUS, (props) => <StatusArea {...props} />],
  [FLAGS.TYPE_AREA.PERMISSION, (props) => <PermissionArea {...props} />]
]);

export const InfoArea = ({type, ...props}) => (
  <div className={"information-area"}>
    {areaMap.get(type)(props)}
  </div>
);
