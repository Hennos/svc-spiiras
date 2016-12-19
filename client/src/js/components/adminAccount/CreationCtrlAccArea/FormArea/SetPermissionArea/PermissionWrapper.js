import React from 'react';

import {Permission} from './Permission/index'

export const PermissionWrapper = ({permission, onChange}) => (
  <div className="permission-wrapper">
    {permission.map(
      entry =>
        <Permission
          key={entry.props.name}
          child={entry.view}
          onChange={onChange}
          {...entry.props}
        />
    )}
  </div>
);
