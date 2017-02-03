import React from 'react';

import {user as userFields} from '../../../../../../constants/user';

import {Permission} from './Permission/index';
import {BasePermission} from './Permission/BasePermission/index';
import {PassPermission} from './Permission/PassPermission';

const permissionFields = userFields.permission.fields;
const arrayPermission = [{
  props: {
    title: "Совершать вызовы",
    name: permissionFields.makeCalls
  },
  view: BasePermission
}, {
  props: {
    title: "Принудительный вызов",
    name: permissionFields.forcedCall
  },
  view: BasePermission
}, {
  props: {
    title: "Взаимодействие с интерактивной доской",
    name: permissionFields.interactiveBoard
  },
  view: BasePermission
}, {
  props: {
    title: "Добавлять друзей",
    name: permissionFields.addingFriends
  },
  view: BasePermission
}, {
  props: {
    title: "Запрашивать пароль при попытке выхода из профиля",
    name: permissionFields.passwordExitProfile
  },
  view: PassPermission
}, {
  props: {
    title: "Запрашивать пароль при манипуляции аудио/видео потоком",
    name: permissionFields.passwordManipulationOfAudioVideo
  },
  view: PassPermission
}];

export const PermissionWrapper = ({values, onChange}) =>(
  <div className="info-elements-wrapper fat-elements">
    {arrayPermission.map(entry => <
        Permission key={entry.props.name}
                   child={entry.view}
                   value={values.has(entry.props.name) ? values.get(entry.props.name).checked : false}
                   onChange={onChange}
        {...entry.props}
      />
    )}
  </div>
);
