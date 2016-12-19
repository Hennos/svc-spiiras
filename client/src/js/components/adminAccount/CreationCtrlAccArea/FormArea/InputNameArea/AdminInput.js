import React from 'react'

export const AdminInput = ({title, name, onChange}) => (
  <div className="input_wrapper">
    <div className="name_block">
      <p>{title}</p>
    </div>
    <div className="input_block">
      <input
        type="text" name={name}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </div>
  </div>
);
