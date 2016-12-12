import React from 'react'

const SideMenuButton = ({onClick, view}) => (
  <div className="button_wrapper">
    <div className="button" onClick={onClick}>
      <p className={view}/>
    </div>
  </div>
);

export default SideMenuButton;
