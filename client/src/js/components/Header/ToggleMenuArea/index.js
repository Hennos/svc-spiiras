import React from 'react';
import {connect} from 'react-redux';

import {toggleVisibilitySideMenu} from '../../../actions/visibility'

import ToggleMenuButton from './ToggleMenuButton'

const ToggleMenuArea = ({onToggleMenu}) => (
  <div className="toggle-side-menu-area">
    <ToggleMenuButton onClick={onToggleMenu}/>
  </div>
);

const mapDispatchHeaderProps = (dispatch) => {
  return {
    onToggleMenu: () => {
      dispatch(toggleVisibilitySideMenu());
    }
  };
};

export default connect(null, mapDispatchHeaderProps)(ToggleMenuArea);
