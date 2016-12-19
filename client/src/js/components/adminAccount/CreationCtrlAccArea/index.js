import React from 'react';
import {connect} from 'react-redux';

import _ from 'lodash';

import {HeaderArea} from './HeaderArea';
import {FormArea} from './FormArea/index';

import {emitCreateCtrlAccount} from '../../../actions/adminAccount';

class CreationCtrlAccArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      general: {},
      permission: {},
      failCreation: false
    }
  }

  render() {

    return (
      <div className="account-creating_wrapper">
        <HeaderArea title="Создание нового аккаунта:"/>
        <FormArea onChangeInputName={this.setGeneralInputState}
                  onChangePermission={this.setPermissionState}
                  onSubmit={this.pushCtrlAccount}
        />
      </div>
    )
  }

  setGeneralInputState = (name, value) =>
    this.setState((prevState) => {
      let postInputs = _.cloneDeep(prevState.general);
      if (value) {
        postInputs[name] = value;
      } else {
        delete postInputs[name];
      }
      return {general: postInputs};
    });

  setPermissionState = (name, value) =>
    this.setState((prevState) => {
      let postPermission = _.cloneDeep(prevState.permission);
      if (value) {
        postPermission[name] = value;
      } else {
        delete postPermission[name];
      }
      return {permission: postPermission};
    });

  pushCtrlAccount = () => {
    const {general, permission} = this.state;
    const {email, password, username} = general;
    return (email && password && username) ?
      this.props.createCtrlAccount({email, password, username, permission})
      :
      this.setState({failCreation: true});
  };
}

const mapDispatchCreatingAreaProps = (dispatch) => {
  return {
    createCtrlAccount: (status)=> {
      dispatch(emitCreateCtrlAccount(status));
    }
  };
};

export default connect(null, mapDispatchCreatingAreaProps)(CreationCtrlAccArea);
