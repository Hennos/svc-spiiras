import React, { PropTypes }  from 'react';
import {toggleVisibilityAppComponent} from  '../actions/visibility';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../constants/visibility'

const sideMenu = {


  button_menu_wrapper: [
    {
      buttonState: 'off',
      image: 'fa fa-bars',
      name: componentsVisibilityToggles.sideMenu
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


const SideMenuButton = ({onClick, buttonState, image, name}) =>(
  <div className={"button " + buttonState} onClick={onClick}>
    <p className={image}></p>
  </div>
);


let SideMenu = ({onButtonClick, buttonsBlocks, visible}) => (

  <div className='side-menu_wrapper'  style={{
                height: visible ? '100%':'auto' }}>

    <div className='button-menu_wrapper block' >
      {sideMenu.button_menu_wrapper.map(button =>
        <SideMenuButton
          key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
        />
      )}

    </div>
    <div className='block' style={{
                display: visible ? 'block':'none' }}>
      {sideMenu.videochat_block.map(button =>
        <SideMenuButton
          key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
        />
      )}
    </div>

    <div className='block' style={{
                display: visible ? 'block':'none' }}>
      {sideMenu.controls_block.map(button =>
        <SideMenuButton
          key={button.name} {...button} onClick={() => {onButtonClick(button.name)}}
        />
      )}
    </div>


  </div>
);

const mapStateSideMenuProps = (state, ownProps) => {

  return{
    visible : state.componentsVisibilityFilter.get(componentsVisibilityToggles.sideMenu)
  };
};

const mapDispatchToSideMenuProps = (dispatch) => {
  return {
    onButtonClick: (name)=> {
      dispatch(toggleVisibilityAppComponent(name));
    }
  };
};




SideMenu = connect(mapStateSideMenuProps, mapDispatchToSideMenuProps)(SideMenu);
export default SideMenu;
