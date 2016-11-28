import React from 'react';
import {connect} from 'react-redux';

import {adminAccount as adminField} from '../../constants/adminAccount'
import {Events} from '../../constants/adminAccount'

import {
  emitCreateCtrlAccount,
  emitRemoveCtrlAccount
}from '../../actions/adminAccount'

import {CreationCtrlAccArea} from './CreationCtrlAccArea'
import {ShowingCtrlAccArea} from './ShowingCtrlAccArea'

class adminAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      general: {},
      permission: {},
      failCreation: false
    }
  }

  render() {
    const {admined} = this.props;
    return (
      <div className="admin-acc-component_wrapper">
        <div className="admined_user_wrapper">
          <CreationCtrlAccArea
            onChangeInputName={event => this.setGeneralInputState(event.target)}
            onChangePermission={event => this.setPermissionState(event.target)}
            onSubmit={() => this.pushCtrlAccount(this.state)}
          />
          <ShowingCtrlAccArea
            admined={admined}
            deleteCtrlAccount={() => this.deleteCtrlAccount(event.target)}
          />
        </div>
      </div>
    );
  }

  setGeneralInputState = ({name, value}) =>
    this.setState((prevState) => {
      let postInputs = Object.assign({}, prevState.general);
      if (value) {
        postInputs[name] = value;
      } else {
        delete postInputs[name];
      }
      return {general: postInputs};
    });

  setPermissionState = ({name, checked}) =>
    this.setState((prevState) => {
      let postPermission = Object.assign({}, prevState.permission);
      if (checked) {
        postPermission[name] = checked;
      } else {
        delete postPermission[name];
      }
      return {permission: postPermission};
    });

  pushCtrlAccount = ({general, permission}) => {
    const {email, password, username} = general;
    return (email && password && username) ?
      this.props.createCtrlAccount({email, password, username, permission})
      :
      this.setState({failCreation: true});
  };

  deleteCtrlAccount = ({value}) =>
    this.props.deleteCtrlAccount(value);
}

const mapDispatchAdminAccountProps = (dispatch) => {
  return {
    createCtrlAccount: (status)=> {
      dispatch(emitCreateCtrlAccount(status));
    },
    deleteCtrlAccount: (userName)=> {
      dispatch(emitRemoveCtrlAccount(userName));
    }
  };
};

const mapStateAdminAccountProps = (state, ownProps) => {
  return {
    admined: state.adminAccount
      .get(adminField.admined)
      .toArray()
  };
};

export default connect(mapStateAdminAccountProps, mapDispatchAdminAccountProps)(adminAccount);
