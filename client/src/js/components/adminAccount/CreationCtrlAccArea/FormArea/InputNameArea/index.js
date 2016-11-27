import React from 'react'

import {AdminInput} from './AdminInput'

const InputsMap = [
  {title: "Логин", name: "username", type: "text"},
  {title: "Пароль", name: "password", type: "text"},
  {title: "Email", name: "email", type: "text"}
];

export const InputNameArea = ({onChange}) => (
  <div className="name-input">
    {InputsMap.map(
      entry => <AdminInput key={entry.name} {...entry} onChange={onChange}/>
    )}
  </div>
);
