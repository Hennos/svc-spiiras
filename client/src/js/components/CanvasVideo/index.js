import React from 'react';
import {connect} from 'react-redux';
import {DOMElements, Stream} from  '../../constants/videoCamera';



class VideoCanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.canvasWidth = 320;
    this.canvasHeight =  240;
    this.fps = 15;
    this.canvasFPSTimerID = undefined;
    this.canvasID = 'canvas-video';

  };

  componentDidMount(){
    this.canvasElement = document.getElementById(this.canvasID);
    this.canvasElementContext = this.canvasElement.getContext("2d");
  };

  componentWillUnmount(){
    this.clearCanvas(this.canvasElementContext);
    clearTimeout(this.canvasFPSTimerID);
  };

  componentDidUpdate(nextProps){
    this.cameraVideoDOMElement = this.props.cameraVideoDOMElement;

    if(this.cameraVideoDOMElement && this.props.stream && this.canvasElementContext){
        let canvasStream = this.canvasElement.captureStream(this.fps);
  
        this.drawFrame(this.props.cameraVideoDOMElement);

    }else {
      this.clearCanvas(this.canvasElementContext);
      clearTimeout(this.canvasFPSTimerID);
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
    this.canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.fps);
  };

  animationCycle(){
    requestAnimationFrame(this.drawFrame.bind(this));
    this.canvasElementContext.drawImage(this.cameraVideoDOMElement, 0, 0, this.canvasWidth, this.canvasHeight);
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

