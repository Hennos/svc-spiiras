import React from 'react'

export const Input = ({name, onChange}) => (
  <div className="input_block">
    <input
      type="text" name={name}
      onChange={(event) => onChange(name, event.target.value)}
    />
  </div>
);
