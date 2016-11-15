import React from 'react';
import {connect} from 'react-redux';

import {sideMenuToggleKey} from '../../constants/visibility'
import {toggleVisibilitySideMenu} from '../../actions/visibility'

import SideMenuButton from './SideMenuButton'

class ToggleMenuButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onButtonClick} = this.props;
    const buttonMap = this.generateButtonMap();
    return (
      <div className='button-menu_wrapper block'>
        <SideMenuButton
          key={buttonMap.name} {...buttonMap} onClick={() => {onButtonClick(buttonMap.name)}}
        />
      </div>
    )
  }

  generateButtonMap = () => {
    return {
      buttonState: 'off',
      image: 'fa fa-bars',
      name: sideMenuToggleKey
    };
  }
}

const mapDispatchToSideMenuProps = (dispatch) => {
  return {
    onButtonClick: (name) => {
      dispatch(toggleVisibilitySideMenu(name));
    }
  };
};

export default connect(null, mapDispatchToSideMenuProps)(ToggleMenuButton);
