import React from 'react';
import {connect} from 'react-redux';

import {adminAccount as adminField} from '../../../constants/adminAccount';

import {emitRemoveCtrlAccount} from '../../../actions/adminAccount';

import {HeaderArea} from './HeaderArea';
import {CtrlAccountsArea} from './CtrlAccountsArea/index';

class ShowingCtrlAccArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {admined} = this.props;
    return (
      <div className="admined_user">
        <CtrlAccountsArea accounts={admined} onDeleteAccount={this.deleteCtrlAccount}/>
      </div>
    )
  }

  deleteCtrlAccount = (userName) =>
    this.props.deleteCtrlAccount(userName);
}

const mapDispatchShowingAreaProps = (dispatch) => {
  return {
    deleteCtrlAccount: (userName)=> {
      dispatch(emitRemoveCtrlAccount(userName));
    }
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
