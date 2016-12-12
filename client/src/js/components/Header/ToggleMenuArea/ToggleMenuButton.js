import React from 'react'

const ToggleMenuButton = ({onClick}) => (
  <div className="button_wrapper">
    <div className="button" onClick={onClick}>
      <p className="fa fa-bars"/>
    </div>
  </div>
);

export default ToggleMenuButton;
