import React from 'react'

import {connect} from 'react-redux';

import {user as userFields} from '../../../../constants/user'

import ExitButton from './ExitButton'

const ExitArea = ({exitPassword}) => (
  <div className="exit-area">
    <ExitButton exitPassword={exitPassword}/>
  </div>
);

const mapStateExitAreaProps = (state) => {
  return {
    exitPassword: state.user
      .get(userFields.permission.id)
      .get(userFields.permission.fields.passwordExitProfile)
  };
};

export default connect(mapStateExitAreaProps)(ExitArea);
