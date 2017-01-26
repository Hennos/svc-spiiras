import React from 'react';
import {connect} from 'react-redux';
import {toggleCameraCanvasComponentState} from '../actions/videoCamera'
import {Parameters, DOMElements, Stream} from  '../constants/videoCamera';


class Canvas extends React.Component{
  constructor(props) {
    super(props);

    //creation of canvas
    this._canvasElement = document.createElement('canvas');
    this._canvasElementContext = this._canvasElement.getContext("2d");

    //creation the id of animation cycle
    this._canvasFPSTimerID = undefined;
    this.setParametrs({id:null, frameRate:null, width:null, height:null});
  }

  componentDidMount(){
    this.props.newCanvasComponentState(this._canvasElement);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.stream)this.startCapturingFromVideo();
    else if (!this.props.stream && this._canvasFPSTimerID) this.stopCapturingFromVideo();
  }

  setParametrs({id, frameRate, width, height}) {
    this._canvasElement.id = id ? id : 'canvas-video';
    this._canvasElementContext.width = width ? width : 320;
    this._canvasElementContext.height = height ? height : 240;
    this.frameRate = frameRate ? frameRate : 25;
    this._canvasWidth = this._canvasElement.width;
    this._canvasHeight= this._canvasElement.height;
  }

  startCapturingFromVideo(){
      this._canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  };

  animationCycle(){
    requestAnimationFrame(this.startCapturingFromVideo.bind(this));
    this._canvasElementContext.drawImage(this.props.videoElement, 0, 0, this._canvasWidth, this._canvasHeight);
  }

  stopCapturingFromVideo(){
      clearTimeout(this._canvasFPSTimerID);
    this.clearCanvas();
  }

  clearCanvas(){
    if(this._canvasElementContext){
      //purification of the work area Canvas
      this._canvasElementContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    }
  };

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

export default connect(mapStateCanvasCameraProps, mapDispatchCanvasCameraProps)(Canvas);
