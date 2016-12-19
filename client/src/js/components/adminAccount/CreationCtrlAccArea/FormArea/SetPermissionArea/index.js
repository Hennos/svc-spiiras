import React from 'react'

import {user as userFields} from '../../../../../constants/user'

import {SetPermissionHeader} from './SetPermissionHeader'
import {PermissionWrapper} from './PermissionWrapper'
import {BasePermission} from './Permission/BasePermission/index'
import {PassPermission} from './Permission/PassPermission'

const permission = userFields.permission.fields;
const checkboxMap = [{
  props: {
    title: "Совершать вызовы",
    name: permission.makeCalls
  },
  view: BasePermission
}, {
  props: {
    title: "Принудительный вызов",
    name: permission.forcedCall
  },
  view: BasePermission
}, {
  props: {
    title: "Взаимодействие с интерактивной доской",
    name: permission.interactiveBoard
  },
  view: BasePermission
}, {
  props: {
    title: "Добавлять друзей",
    name: permission.addingFriends
  },
  view: BasePermission
}, {
  props: {
    title: "Запрашивать пароль при попытке выхода из профиля",
    name: permission.passwordExitProfile
  },
  view: PassPermission
}, {
  props: {
    title: "Запрашивать пароль при манипуляции аудио/видео потоком",
    name: permission.passwordManipulationOfAudioVideo
  },
  view: PassPermission
}];

export const SetPermissionArea = ({onChange}) => (
  <div className="set-permission-wrapper">
    <SetPermissionHeader title="Разрешения:"/>
    <PermissionWrapper permission={checkboxMap} onChange={onChange}/>
  </div>
);
