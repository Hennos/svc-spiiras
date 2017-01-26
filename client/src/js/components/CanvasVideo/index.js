import React from 'react';
import {connect} from 'react-redux';
import {DOMElements, Stream} from  '../../constants/videoCamera';




class VideoCanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.canvasWidth = 320;
    this.canvasHeight =  240;
    this.fps = 15;
    this._canvasFPSTimerID = undefined;
    this.canvasID = 'canvas-video';

  };

  componentDidMount(){
    this._canvasElement = document.getElementById(this.canvasID);
    this._canvasElementContext = this._canvasElement.getContext("2d");

    this.cameraVideoDOMElement = this.props.cameraVideoDOMElement;

    if(this.props.cameraVideoDOMElement && this.props.stream && this._canvasElementContext){
      let canvasStream = this._canvasElement.captureStream(this.fps);
      this.drawFrame(this.props.cameraVideoDOMElement);

    }else {
      this.clearCanvas(this._canvasElementContext);
      clearTimeout(this._canvasFPSTimerID);
    }
  };

  componentWillUnmount(){
    this.clearCanvas(this._canvasElementContext);
    clearTimeout(this._canvasFPSTimerID);
  };

  componentDidUpdate(nextProps){
    this.cameraVideoDOMElement = this.props.cameraVideoDOMElement;
    console.log(this.cameraVideoDOMElement);
    if(this.props.cameraVideoDOMElement && this.props.stream && this._canvasElementContext){
        let canvasStream = this._canvasElement.captureStream(this.fps);
          this.drawFrame(this.props.cameraVideoDOMElement);

    }else {
      this.clearCanvas(this._canvasElementContext);
      clearTimeout(this._canvasFPSTimerID);
    }
  };

  clearCanvas(context){
    if(context){
      //purification of the work area Canvas
      context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      context = null;
    }
  };

  drawFrame (){
    this._canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.fps);
  };

  animationCycle(){
    requestAnimationFrame(this.drawFrame.bind(this));
    this._canvasElementContext.drawImage(this.cameraVideoDOMElement, 0, 0, this.canvasWidth, this.canvasHeight);
  };


  render() {
    return (
      <div className="video-camera-component_wrapper display_block">
        <div>
            <canvas id="canvas-video" width={this.canvasWidth} height={this.canvasHeight}/>
        </div>
      </div>
    );
  };


}


/*const mapDispatchVideoCanvasProps = (dispatch) => {
  return {
/!*    onButtonCameraClick: ()=> {
      dispatch(loadVideoCamera());
      dispatch(camera.createToggleDispatcher());
    }*!/
  };
};*/

const mapStateVideoCanvasProps = (state, ownProps) => {
  return {
    cameraVideoDOMElement: state.videoCameraComponent
      .get(DOMElements.videoElement),
    stream: state.videoCameraComponent
      .get(Stream.localStream)
  };
};

export default connect(mapStateVideoCanvasProps/*, mapDispatchVideoCanvasProps*/)(VideoCanvasComponent);

