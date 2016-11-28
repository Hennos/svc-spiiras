import React from 'react'

import {user as userFields} from '../../../../../constants/user'

import {PermissionHeader} from './PermissionHeader'
import {AdminCheckbox} from './AdminCheckbox'

const permission = userFields.permission.fields;
const checkboxMap = [
  {
    title: "Совершать вызовы",
    name: permission.makeCalls
  },
  {
    title: "Добавлять друзей",
    name: permission.addingFriends
  },
  {
    title: "Принудительный вызов",
    name: permission.forcedCall
  },
  {
    title: "Интерактивная доска",
    name: permission.interactiveBoard
  },
  {
    title: "Запрашивать пароль при попытке выхода из профиля",
    name: permission.passwordExitProfile
  },
  {
    title: "Запрашивать пароль при манипуляции аудио/видео потоком",
    name: permission.passwordManipulationOfAudioVideo
  }
];

export const SetPermissionArea = ({onChange}) => (
  <div className="permission_wrapper">
    <PermissionHeader title="Разрешения:" />
    {checkboxMap.map(
      entry => <AdminCheckbox key={entry.name} {...entry} onChange={onChange}/>
    )}
  </div>
);
