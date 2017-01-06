import React from 'react';

export const Button = ({view, onClick}) => (
  <div className="button" onClick={onClick}>
    <p className={view}/>
  </div>
);
