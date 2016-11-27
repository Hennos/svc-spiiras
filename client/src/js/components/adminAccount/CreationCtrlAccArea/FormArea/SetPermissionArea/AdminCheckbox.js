import React from 'react';

export const AdminCheckbox = ({title, ...props}) => (
  <div className="checkbox_wrapper">
    <div className="name_block">
      <p>{title}</p>
    </div>
    <div className="checkbox_block">
      <input type="checkbox" {...props}/>
    </div>
  </div>
);
