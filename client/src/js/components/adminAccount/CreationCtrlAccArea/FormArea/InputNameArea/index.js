import React from 'react'

import {AdminInput} from './AdminInput'

const InputsMap = [
  {title: "Логин", name: "username"},
  {title: "Пароль", name: "password"},
  {title: "Email", name: "email"}
];

export const InputNameArea = ({onChange}) => (
  <div className="name-input">
    {InputsMap.map(
      entry => <AdminInput key={entry.name} {...entry} onChange={onChange}/>
    )}
  </div>
);
