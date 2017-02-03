import React from 'react';

export const Checkbox = ({name, value, onChange}) => (
  <div className="checkbox_block">
    <input
      type="checkbox" value={name}
      checked={value}
      onChange={(event) => onChange(name)}
    />
  </div>
);
