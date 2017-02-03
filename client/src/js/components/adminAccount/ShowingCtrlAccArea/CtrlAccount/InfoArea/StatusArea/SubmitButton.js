import React from 'react'

export const SubmitButton = ({name, value, onSubmit}) => (
  <div className="submit-button">
    <input type="button" name={name} value={value} onClick={onSubmit}/>
  </div>
);
