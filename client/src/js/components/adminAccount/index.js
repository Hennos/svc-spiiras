import React from 'react';

import CreationCtrlAccArea from './CreationCtrlAccArea';
import ShowingCtrlAccArea from './ShowingCtrlAccArea';

class adminAccount extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="admin-acc-component_wrapper">
        <div className="admined-user-wrapper">
          <CreationCtrlAccArea/>
          <ShowingCtrlAccArea/>
        </div>
      </div>
    );
  }
}

export default adminAccount;
