import React from 'react'

import {InputNameArea} from './InputNameArea/index'
import {SetPermissionArea} from './SetPermissionArea/index'
import {SubmitButton} from './SubmitButton'

export const FormArea =
  ({onChangeInputName, onChangePermission, onSubmit}) => (
    <div className="creating_form_wrapper">
      <InputNameArea onChange={onChangeInputName}/>
      <SetPermissionArea onChange={onChangePermission}/>
      <SubmitButton
        name='Submit' value="Создать аккаунт"
        onClick={onSubmit}/>
    </div>
  );
