import React from 'react';
import {connect} from 'react-redux';


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

  setParametrs({id, frameRate, width, height}) {
    this._canvasElement.id = id ? id : 'canvas-video';
    this._canvasElementContext.width = width ? width : 320;
    this._canvasElementContext.height = height ? height : 240;
    this.frameRate = frameRate ? frameRate : 25;
    this._canvasWidth = this._canvasElement.width;
    this._canvasHeight= this._canvasElement.height;
  }

  stopCapturing(){
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


export default Canvas;
