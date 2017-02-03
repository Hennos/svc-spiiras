import React from 'react'

export const ImageArea = ({image}) => (
  <div className="img-place">
    {(image) ?
      <img src={image} alt="?"/>
      :
      <p className="fa fa-question-circle" />
    }
  </div>
);
