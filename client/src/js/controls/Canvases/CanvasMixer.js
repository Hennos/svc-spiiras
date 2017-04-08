import React from 'react';
import {connect} from 'react-redux';
import {newCanvasMixer} from '../../actions/videoMixer';
import {Parameters, DOMElements, Stream} from  '../../constants/videoCamera';
import Canvas  from './Canvas';
import {Chat} from  '../../constants/chat';
import Container from './Container'
import _ from 'lodash'


class CanvasMixer extends Canvas {
  constructor(props) {
    super(props);
    this.setParametrs({id: 'canvas-mixer', frameRate: null, width: 1, height: 1});

    this.containers = [];

    this._isCapturing = false;

    this.containers.push(new Container({
      maxObjectsInLine: 2,
      objectSize: {width: 320, height: 240},
      basePosition: {x: 0, y: 0},
      isHorizontal: true
    }));

    this.containers.push(new Container({
      maxObjectsInLine: 3,
      objectSize: {width: 160, height: 120},
      basePosition: {x: 640, y: 0},
      isHorizontal: false
    }));
  }

  componentDidMount() {
    this.props.newCanvasComponentState(this._canvasElement);
  }

  componentDidUpdate(prevProps, prevState) {
    let keysOld = _.keys(prevProps.videoElements);
    let keysCurrent = _.keys(this.props.videoElements);

    if (keysCurrent.length > keysOld.length) {

      _.difference(keysCurrent, keysOld).forEach((key)=> {
        let i = 0;
        while (i < 10) {
          this.containers[0].addNewObject(key + i);
          this.containers[1].addNewObject(key + i);
          this._recalculateCanvasSize();
          i++;
        }

        i = 0;
        while (i < 10) {
          if(i%2 == 0){
            this.containers[0].deleteObject(key + i);
            this.containers[1].deleteObject(key + i);
            this._recalculateCanvasSize();
          }
          i++;
        }

      });



    } else if (keysCurrent.length < keysOld.length) {

      _.difference(keysOld, keysCurrent).forEach((key)=> {
        let i = 0;
          while (i < 10) {
            this.containers[0].deleteObject(key + i);
            this.containers[1].deleteObject(key + i);
            this._recalculateCanvasSize();
            i++;
          }

      });
    }

    if((_.keys(this.props.videoElements).length > 0) && !this._isCapturing){
      this.startCapturingFromVideo();
      this._isCapturing = true;
    }
    else if ((_.keys(this.props.videoElements).length === 0) && this._canvasFPSTimerID && this._isCapturing){
      console.log('Stop!');
      this._isCapturing = false;
      this.stopCapturing();
    }
  }

 _recalculateCanvasSize() {
    let width = 0;
    let height = 0;
    let containerWidth = 0;
    let containerHeight = 0;
    let allContainersEmpty = true;


    this.containers.forEach((container)=> {
      containerWidth = container.width + container.positionX;
      containerHeight = container.height + container.positionY;
      if (width < containerWidth) {
        width = containerWidth;
        this._canvasElement.width = width;
        this._canvasElementContext.width = width;
      }

      if (height < containerHeight) {
        height = containerHeight;
        this._canvasElement.height = height;
        this._canvasElementContext.height = height;
      }
      if(!container.isEmpty()){
        allContainersEmpty = false
      }
    });

    if (allContainersEmpty){
      this._canvasElement.width = 1;
      this._canvasElementContext.width = 1;
      this._canvasElement.height = 1;
      this._canvasElementContext.height = 1;
    }
  }

  startCapturingFromVideo() {
    this._canvasFPSTimerID = setTimeout(this.animationCycle.bind(this), 1000 / this.frameRate);
  };

  animationCycle() {
    requestAnimationFrame(this.startCapturingFromVideo.bind(this));
    this.containers.forEach((container)=> {
      container.objects.forEach((element)=> {
        this._canvasElementContext.drawImage(
          this.props.videoElements[element.name.slice(0, -1)],
          element.coordinates.x, element.coordinates.y,
          container._objectWidth, container._objectHeight
        );
      })

    });
  }

  render() {
    return null;
  }
}

const mapDispatchCanvasMixerProps = (dispatch) => {
  return {
    newCanvasComponentState: (element) => {
      dispatch(newCanvasMixer(element))
    }
  };
};

const mapStateCanvasMixerProps = (state, ownProps) => {
  let videoElements = {};
  let isWorking = state.videoCameraComponent.get(Parameters.isWorking);
  if (isWorking) videoElements['local'] = state.videoCameraComponent.get(DOMElements.videoElement);

  state.chat.get(Chat.sides).forEach((value, key) => {
    if (value.video) videoElements[key] = value.video;
  });


  return {
    stream: state.videoCameraComponent
      .get(Stream.localStream),
    isWorking,
    videoElements
  };
};

export default connect(mapStateCanvasMixerProps, mapDispatchCanvasMixerProps)(CanvasMixer);
