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

  }

  componentDidMount(){
    this.canvasElementContext = document.getElementById(canvasParameters.canvasID).getContext("2d");
  }

  componentWillUnmount(){

    console.log('Unmount');
    if(this.canvasElement)
      this.canvasElement.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasElement = null;
    clearTimeout(this.canvasFPSTimerID);
  }

  componentDidUpdate(nextProps){
    this.cameraVideoDOMElement = this.props.cameraVideoDOMElement;
    if(this.cameraVideoDOMElement && this.props.stream && this.canvasElementContext){
      this.getFrame(this.props.cameraVideoDOMElement);
    }else {
      console.log('Update', this.canvasElement);
      if(this.canvasElement)
        this.canvasElement.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.canvasElement = null;
      clearTimeout(this.canvasFPSTimerID);
    }
  };


  getFrame (){
    let that = this;
    this.canvasFPSTimerID = setTimeout(() => {
      requestAnimationFrame(that.getFrame);
      that.canvasElementContext.
        drawImage(that.cameraVideoDOMElement, 0, 0, that.canvasWidth, that.canvasHeight);
    }, 1000 / that.fps);
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

