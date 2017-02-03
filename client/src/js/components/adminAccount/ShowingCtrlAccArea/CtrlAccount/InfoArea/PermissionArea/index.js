import React from 'react';
import {connect} from 'react-redux';

import _ from 'lodash';

import {user as userFields} from '../../../../../../constants/user';

import {emitUpdateCtrlAccount} from '../../../../../../actions/adminAccount';

import {HeaderArea} from './HeaderArea';
import {PermissionWrapper} from './PermissionWrapper';
import {SubmitButton} from './SubmitButton';

class PermissionArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      permission: new Map(_.toPairs(this.props.value.permission)
        .map(([key,value]) => [key, {
          checked: value,
          value: null
        }])
      )
    }
  }

  render() {
    const {permission} = this.state;
    return (
      <div className="permissions-area">
        <HeaderArea title="Разрешения"/>
        <PermissionWrapper values={permission} onChange={this.changePermission}/>
        <SubmitButton name='Submit' value="Сохранить изменения"
                      onSubmit={this.submitUpdating}
        />
      </div>
    );
  }

  changePermission = (name, value) =>
    this.setState((prevState) => {
      let postPermission = new Map(prevState.permission);
      let changedValue = Object.assign({}, postPermission.get(name));
      if (typeof value === 'string') {
        changedValue.value = value || null;
      } else {
        changedValue.checked = !changedValue.checked;
        changedValue.value = value;
      }
      return {
        permission: postPermission.set(name, changedValue)
      };
    });

  submitUpdating = () => {
    let upPermission = {};
    this.state.permission.forEach((elem, key) => {
      upPermission[key] = elem.value
    });
    const value = {
      permission: upPermission
    };
    this.props.onSubmitUpdate(value);
  }
}

export default PermissionArea;
