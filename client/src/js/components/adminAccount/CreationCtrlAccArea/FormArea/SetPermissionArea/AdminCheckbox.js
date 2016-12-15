import React from 'react';

export const AdminCheckbox = ({title, name, onChange}) => (
  <div className="checkbox_wrapper">
    <div className="name_block">
      <p>{title}</p>
    </div>
    <div className="checkbox_block">
      <input type="checkbox" name={name} onChange={(events) => onChange(events.target)}/>
    </div>
  </div>
);
