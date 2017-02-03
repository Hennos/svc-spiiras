import React from 'react';
import {connect} from 'react-redux';

import {adminAccount as adminField} from '../../../constants/adminAccount';

import {
  emitRemoveCtrlAccount,
  emitUpdateCtrlAccount
} from '../../../actions/adminAccount';

import CtrlAccount from './CtrlAccount/index';

class ShowingCtrlAccArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {admined} = this.props;
    return (
      <div className="admined_user">
        {admined.length > 0 ?
          admined.map(entry =>
            <CtrlAccount
              key={entry.username}
              onDeleteAcc={this.deleteAccount}
              onUpdateAcc={this.updateAccount}
              {...entry}
            />)
          :
          <p>Нет созданных аккаунтов</p>
        }
      </div>
    )
  }

  deleteAccount = (name) =>
    this.props.deleteAccount(name);

  updateAccount = (name) => (value) =>
    this.props.updateCtrlAccount({name, value});
}

const mapDispatchShowingAreaProps = (dispatch) => {
  return {
    deleteCtrlAccount: (userName) => dispatch(emitRemoveCtrlAccount(userName)),
    updateCtrlAccount: (updating) => dispatch(emitUpdateCtrlAccount(updating))
  };
};

const mapStateShowingAreaProps = (state, ownProps) => {
  return {
    admined: state.adminAccount
      .get(adminField.admined)
      .toArray()
  };
};

export default connect(mapStateShowingAreaProps, mapDispatchShowingAreaProps)(ShowingCtrlAccArea);
