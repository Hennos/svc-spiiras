import React from 'react'

export const ImageArea = ({value}) => (
  <div className="img_place">
    {(value) ?
      <img src={value} alt="Нет изображения"/>
      :
      <p className="fa fa-question-circle" />
    }
  </div>
);
