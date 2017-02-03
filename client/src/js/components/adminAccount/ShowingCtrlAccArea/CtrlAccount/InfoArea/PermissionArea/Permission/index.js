import React from 'react';

export const Permission = ({child, ...props}) => (
  <div className="permission-area">
    {child(props)}
  </div>
);
