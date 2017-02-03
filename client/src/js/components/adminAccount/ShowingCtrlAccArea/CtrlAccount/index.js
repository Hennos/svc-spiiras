import React from 'react';

import {ControlArea} from './ControlArea/index';
import {InfoArea} from './InfoArea/index';

const FLAGS = {
  INFO: {
    NONE: 0,
    STATUS: 1,
    PERMISSION: 2
  }
};

class CtrlAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: FLAGS.INFO.NONE
    };
  }

  render() {
    const {permission, email, preferences, onUpdateAcc, username, ...props} = this.props;
    const mapInfo = new Map([
      [FLAGS.INFO.STATUS, {
        main: {
          email: email
        },
        preferences: preferences
      }],
      [FLAGS.INFO.PERMISSION, {
        permission: permission
      }]
    ]);

    return (
      <div className={"control-account-area"}>
        <ControlArea
          username={username}
          onShowStatus={this.toggleViewAccStatus}
          onShowPermission={this.toggleViewAccPermission}
          bubbled={this.state.info != FLAGS.INFO.NONE}
          {...props}
        />
        {(this.state.info != FLAGS.INFO.NONE) && <
          InfoArea type={this.state.info}
                   value={mapInfo.get(this.state.info)}
                   onSubmitUpdate={onUpdateAcc(username)}
        />}
      </div>
    )
  }

  toggleViewAccStatus = () => this._setInfoArea(
    (this.state.info == FLAGS.INFO.STATUS) ?
      FLAGS.INFO.NONE
      :
      FLAGS.INFO.STATUS
  );

  toggleViewAccPermission = () => this._setInfoArea(
    (this.state.info == FLAGS.INFO.PERMISSION) ?
      FLAGS.INFO.NONE
      :
      FLAGS.INFO.PERMISSION
  );

  _setInfoArea = (area) => {
    (this.state.info != area) && this.setState({info: area});
  }
}

export default CtrlAccount;
