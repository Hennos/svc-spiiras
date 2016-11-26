import React, { PropTypes } from 'react';
import {connect} from 'react-redux';

import {user as userFields} from '../../constants/user';
import {adminAccount} from '../../constants/adminAccount';
import {componentsVisibilityToggles} from '../../constants/visibility';
import {sideMenuToggleKey} from '../../constants/visibility';
import {toggleVisibilityAppComponent} from  '../../actions/visibility';

import SideMenuButton from './SideMenuButton';

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible, admin, onButtonClick} = this.props;
    const buttonMaps = this.generateButtonsMaps();
    return (
      <div className={'side-menu_wrapper' + (visible ? ' height_full' : ' height_auto')}>
        <div className={'block' + (visible ? ' display_block' : ' display_none')}>
          {buttonMaps.videochat_block
            .map(button =>
              <SideMenuButton
                key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
              />
            )}
        </div>

        <div className={'block' + (visible ? ' display_block' : ' display_none')}>
          {buttonMaps.controls_block
            .filter(button => {
              return admin || (button.name !=  componentsVisibilityToggles.administrationAccount);
            })
            .map(button =>
              <SideMenuButton
                key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
              />
            )}
        </div>
      </div>
    );
  }

  generateButtonsMaps = () => {
    return {
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
          name: componentsVisibilityToggles.administrationAccount
        },
        {
          buttonState: 'off',
          image: 'fa fa-sliders',
          name: componentsVisibilityToggles.cameraAudioPreferences
        }
      ]
    };
  }
}

const mapDispatchToSideMenuProps = (dispatch) => {
  return {
    onButtonClick: (name) => {
      dispatch(toggleVisibilityAppComponent(name));
    }
  };
};

const mapStateSideMenuProps = (state, ownProps) => {
  return {
    admin: state.user
      .get(userFields.admin),
    visible: state.componentsVisibilityFilter
      .get(sideMenuToggleKey)
  };
};

export default connect(mapStateSideMenuProps, mapDispatchToSideMenuProps)(SideMenu);
