import React from 'react';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'
import {Parameters} from  '../constants/videoCamera';
import {loadVideoCamera, toggleVideoCameraState} from '../actions/videoCamera';
import Camera from '../controls/Camera'

let cameraParameters = {
  videoID: 'camera-video',
  constraints: {
    audio: false,
    video: {
      width: 320,
      height: 240,
      frameRate: {ideal: 10, max: 15}
    }
  }
};
let camera = new Camera(cameraParameters);

const ButtonOnOff = ({isWorking, onClick})=>(
  <div className="video-camera_toggle-button" onClick={onClick}>
    <p className="text">{isWorking ? "Off" : "On"}</p>
    <p className={"image fa fa-power-off" + (isWorking ? " off":" on")}></p>
  </div>
);

const LoadingArea = ()=> (
  <div className="video-camera_spinner-area">
    <p className="image fa fa-spinner fa-pulse"></p>
    <p className="text">Loading...</p>
  </div>
);

let VideoCameraComponent = ({isWorking, visible, onButtonCameraClick, isLoading}) => (
  <div className={"video-camera-component_wrapper" + (visible ? " display_block" : " display_none")}>

    <div className="video_wrapper">
      <video id="camera-video"></video>
    </div>

    <div className="controls_wrapper">
      {isLoading ?
        <LoadingArea/>
        :
        <ButtonOnOff isWorking={isWorking} onClick={()=>(onButtonCameraClick())}/>
      }
    </div>

  </div>
);

const mapDispatchVideoCameraProps = (dispatch) => {
  return {
    onButtonCameraClick: ()=> {
      dispatch(loadVideoCamera());
      dispatch(camera.createToggleDispatcher());
    }
  };
};

const mapStateVideoCameraProps = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.videoCamera),
    isWorking: state.videoCameraComponent
      .get(Parameters.isWorking),
    isLoading: state.videoCameraComponent
      .get(Parameters.isLoading)
  };
};

export default connect(mapStateVideoCameraProps, mapDispatchVideoCameraProps)(VideoCameraComponent);
