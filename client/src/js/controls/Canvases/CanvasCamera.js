import React from 'react';
import {connect} from 'react-redux';
import {toggleCameraCanvasComponentState} from '../../actions/videoCamera'
import {Parameters, DOMElements, Stream} from  '../../constants/videoCamera';
import Canvas  from './Canvas';


class CanvasCamera extends Canvas{
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.newCanvasComponentState(this._canvasElement);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.stream)this.startCapturingFromVideo();
    else if (!this.props.stream && this._canvasFPSTimerID) this.stopCapturing();
  }

  startCapturingFromVideo(){
      this._canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  };

  animationCycle(){
    requestAnimationFrame(this.startCapturingFromVideo.bind(this));
    this._canvasElementContext.drawImage(this.props.videoElement, 0, 0, this._canvasWidth, this._canvasHeight);
  }

  render(){return null;}
}

const mapDispatchCanvasCameraProps = (dispatch) => {
  return {
    newCanvasComponentState: (element) =>{
      dispatch(toggleCameraCanvasComponentState(element))
    }
  };
};

const mapStateCanvasCameraProps = (state, ownProps) => {
  return {
    stream: state.videoCameraComponent
      .get(Stream.localStream),
    isWorking: state.videoCameraComponent
      .get(Parameters.isWorking),
    videoElement: state.videoCameraComponent
      .get(DOMElements.videoElement)
  };
};

export default connect(mapStateCanvasCameraProps, mapDispatchCanvasCameraProps)(CanvasCamera);
