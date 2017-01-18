import React from 'react';
import {connect} from 'react-redux';
import {DOMElements, Stream} from  '../../constants/videoCamera';

let canvasParameters = {
  canvasID: 'canvas-video'
};


class VideoCanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.canvasWidth = 320;
    this.canvasHeight =  240;
    this.fps = 15;
    this.canvasFPSTimerID = undefined;

  };

  componentDidMount(){
    console.log('Mount');
    this.canvasElementContext = document.getElementById(canvasParameters.canvasID).getContext("2d");
  };

  componentWillUnmount(){
    console.log('Unmount');
    this.clearCanvas(this.canvasElementContext);
    clearTimeout(this.canvasFPSTimerID);
  };

  componentDidUpdate(nextProps){
    console.log('Update');
    this.cameraVideoDOMElement = this.props.cameraVideoDOMElement;
    if(this.cameraVideoDOMElement && this.props.stream && this.canvasElementContext){
      this.drawFrame(this.props.cameraVideoDOMElement);
    }else {
      this.clearCanvas(this.canvasElementContext);
      clearTimeout(this.canvasFPSTimerID);
    }
  };

  clearCanvas(context){
    if(context){
      console.log('Delete Canvas');
      //purification of the work area Canvas
      context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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

