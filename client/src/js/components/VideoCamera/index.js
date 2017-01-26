import React from 'react';
import {connect} from 'react-redux';
import {Stream, Parameters, DOMElements} from  '../../constants/videoCamera';
import {loadVideoCamera, toggleCameraVideoComponentState} from '../../actions/videoCamera';
import ButtonOnOff from './ButtonOnOff'
import LoadingArea from './LoadingArea'


class VideoCameraComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    if(this.props.videoElement.src){
      this.props.videoElement.play();
    }
    this.refs['video_wrapper'].append(this.props.videoElement);
    /*this.refs['video_wrapper'].append(this.props.canvasElement);*/

  }

  componentDidUpdate(){
    this.refs['video_wrapper'].append(this.props.videoElement);
    /*this.refs['video_wrapper'].append(this.props.canvasElement);*/

  }

  componentWillUnmount(){
    this.refs['video_wrapper'].append('');
  }

  render() {
    const {isWorking, onButtonCameraClick, isLoading, stream} = this.props;
    return (
      <div className="video-camera-component_wrapper display_block">
        <div className="video_wrapper" ref ='video_wrapper'>
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
    newVideoComponentState: (element) =>{
      dispatch(toggleCameraVideoComponentState(element))
    },
    onButtonCameraClick: ()=> {
      dispatch(loadVideoCamera());
    }
  };
};

const mapStateVideoCameraProps = (state, ownProps) => {
  return {
    stream: state.videoCameraComponent
      .get(Stream.localStream),
    isWorking: state.videoCameraComponent
      .get(Parameters.isWorking),
    isLoading: state.videoCameraComponent
      .get(Parameters.isLoading),
    videoElement: state.videoCameraComponent
      .get(DOMElements.videoElement),
    canvasElement: state.videoCameraComponent
      .get(DOMElements.canvasElement)
  };
};

export default connect(mapStateVideoCameraProps, mapDispatchVideoCameraProps)(VideoCameraComponent);
