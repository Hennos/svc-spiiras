import React from 'react';
import {connect} from 'react-redux';

import {sideMenuToggleKey} from '../../constants/visibility'
import {toggleVisibilitySideMenu} from '../../actions/visibility'

import ToggleMenuArea from './ToggleMenuArea/index'
import Navigation from './Navigation/index'

const Header = () => (
  <div className="header">
    <ToggleMenuArea/>
    <Navigation/>
  </div>
);

export default Header;
