import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash'
import {user as userFields} from '../../constants/user'

class UserSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {image, username, firstName, lastName, place, type} = this.props;
    return (
      <div className="UserSettings_wrapper">
      <p>{title}</p>
      <input type="text" name="setname"/>
      </div>
  );
  };
}


const mapDispatchUserSettingsProps = (dispatch) => {
  return {
    dispatch
  };
};

export default connect(mapDispatchUserSettingsProps)(UserSettings);
