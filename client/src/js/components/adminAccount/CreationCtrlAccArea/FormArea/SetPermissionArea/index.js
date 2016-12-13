import React from 'react'

import {user as userFields} from '../../../../../constants/user'

import {SetPermissionHeader} from './SetPermissionHeader'
import {PermissionWrapper} from './PermissionWrapper'
import {AdminCheckbox} from './AdminCheckbox'

const permission = userFields.permission.fields;
const checkboxMap = [{
  props: {
    title: "Совершать вызовы",
    name: permission.makeCalls
  },
  view: AdminCheckbox
}, {
  props: {
    title: "Принудительный вызов",
    name: permission.forcedCall
  },
  view: AdminCheckbox
}, {
  props: {
    title: "Взаимодействие с интерактивной доской",
    name: permission.interactiveBoard
  },
  view: AdminCheckbox
}, {
  props: {
    title: "Добавлять друзей",
    name: permission.addingFriends
  },
  view: AdminCheckbox
}, {
  props: {
    title: "Запрашивать пароль при попытке выхода из профиля",
    name: permission.passwordExitProfile
  },
  view: AdminCheckbox
}, {
  props: {
    title: "Запрашивать пароль при манипуляции аудио/видео потоком",
    name: permission.passwordManipulationOfAudioVideo
  },
  view: AdminCheckbox
}];

export const SetPermissionArea = ({onChange}) => (
  <div className="permission_wrapper">
    <SetPermissionHeader title="Разрешения:"/>
    {checkboxMap.map(
      entry =>
        <PermissionWrapper
          key={entry.props.name}
          child={entry.view}
          onChange={onChange}
          {...entry.props}
        />
    )}
  </div>
);
