import React from 'react';

export const Checkbox = ({name, onChange}) => (
  <div className="checkbox_block">
    <input
      type="checkbox" name={name}
      onChange={(event) => onChange(name, event.target.checked)}
    />
  </div>
);
