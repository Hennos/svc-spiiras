import React, { PropTypes }  from 'react';
import {toggleVisibilityAppComponent} from  '../../actions/visibility';
import {toggleVisibilitySideMenu} from '../../actions/visibility';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../../constants/visibility'
import {sideMenuToggleKey} from '../../constants/visibility'

import SideMenuButton from './SideMenuButton'

const sideMenu = {
  button_menu_wrapper: [
    {
      buttonState: 'off',
      image: 'fa fa-bars',
      name: sideMenuToggleKey
    }
  ],

  videochat_block: [
    {
      buttonState: 'off',
      image: 'fa fa-video-camera',
      name: componentsVisibilityToggles.videoCamera
    },
    {
      buttonState: 'off',
      image: 'fa fa-weixin',
      name: componentsVisibilityToggles.chatArea
    },
    {
      buttonState: 'off',
      image: 'fa fa-users',
      name: componentsVisibilityToggles.peopleArea
    }
  ],
  controls_block: [
    {
      buttonState: 'off',
      image: 'fa fa-user',
      name: componentsVisibilityToggles.userPreferences
    },
    {
      buttonState: 'off',
      image: 'fa fa-cogs',
      name: componentsVisibilityToggles.commonPreferences
    },
    {
      buttonState: 'off',
      image: 'fa fa-sliders',
      name: componentsVisibilityToggles.cameraAudioPreferences
    }
  ]
};

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onButtonClick, visible} = this.props;
    return (
      <div className={'side-menu_wrapper' + (visible ? ' height_full' : ' height_auto')}>
        <div className='button-menu_wrapper block'>
          {sideMenu.button_menu_wrapper.map(button =>
            <SideMenuButton
              key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
            />
          )}

        </div>
        <div className={'block' + (visible ? ' display_block' : ' display_none')}>
          {sideMenu.videochat_block.map(button =>
            <SideMenuButton
              key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
            />
          )}
        </div>

        <div className={'block' + (visible ? ' display_block' : ' display_none')}>
          {sideMenu.controls_block.map(button =>
            <SideMenuButton
              key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateSideMenuProps = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter.get(sideMenuToggleKey)
  };
};

const mapDispatchToSideMenuProps = (dispatch) => {
  return {
    onButtonClick: (name)=> {
      if (name != sideMenuToggleKey) {
        dispatch(toggleVisibilityAppComponent(name));
      } else {
        dispatch(toggleVisibilitySideMenu(name));
      }
    }
  };
};

export default connect(mapStateSideMenuProps, mapDispatchToSideMenuProps)(SideMenu);
