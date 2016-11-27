import React from 'react'

export const AdminInput = ({title, ...props}) => (
  <div className="input_wrapper">
    <div className="name_block">
      <p>{title}</p>
    </div>
    <div className="input_block">
      <input {...props}/>
    </div>
  </div>
);
