import React from 'react';
import {connect} from 'react-redux';
import {Parameters} from  '../../constants/videoCamera';
import {loadVideoCamera, toggleVideoCameraState} from '../../actions/videoCamera';
import Camera from '../../controls/Camera'

import ButtonOnOff from './ButtonOnOff'
import LoadingArea from './LoadingArea'

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

class VideoCameraComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isWorking, onButtonCameraClick, isLoading} = this.props;
    return (
      <div className="video-camera-component_wrapper display_block">
        <div className="video_wrapper">
          <video id="camera-video" />
        </div>

        <div className="controls_wrapper">
          {isLoading ?
            <LoadingArea/>
            :
            <ButtonOnOff isWorking={isWorking} onClick={() => (onButtonCameraClick())}/>
          }
        </div>
      </div>
    );
  }
}

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
    isWorking: state.videoCameraComponent
      .get(Parameters.isWorking),
    isLoading: state.videoCameraComponent
      .get(Parameters.isLoading)
  };
};

export default connect(mapStateVideoCameraProps, mapDispatchVideoCameraProps)(VideoCameraComponent);
