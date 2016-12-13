import React from 'react';

export const PermissionWrapper = ({child, ...props}) => (
  <div className="permission-wrapper">{child(props)}</div>
);
