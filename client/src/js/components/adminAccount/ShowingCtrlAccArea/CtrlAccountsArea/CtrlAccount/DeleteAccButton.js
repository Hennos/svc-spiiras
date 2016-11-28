import React from 'react'

export const DeleteAccButton = ({onClick}) => (
  <div className="button_wrapper">
    <div className="button" onClick={onClick}>
      <p className="fa fa-times"/>
    </div>
  </div>
);
