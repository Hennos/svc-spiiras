import React from 'react';
import {connect} from 'react-redux';
import {toggleVideoCameraState, toggleCameraVideoComponentState} from '../actions/videoCamera'
import {Parameters} from  '../constants/videoCamera';


class Camera extends React.Component {
  constructor(props) {

    super(props);
    // for old browsers
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = this.promisifiedOldGUM;
    }

    this.stream = null;
    this._cameraElement = document.createElement('video');
    const parametrs = {id:null, constraints: null};
    this.setParametrs(parametrs);
  }

  componentDidMount(){
    this.props.newVideoComponentState(this._cameraElement);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.isLoading){
      this.toggleCamera();
    }
  }

  setParametrs({id, constraints}) {
    this._cameraElement.id = id ? id : 'camera-video';
    this.constraints = constraints ?
      constraints :
    {audio: false, video: {width: 320, height: 240}, frameRate: {ideal: 10, max: 15}};
  }

  promisifiedOldGUM(constraints, successCallback, errorCallback) {
    // First get ahold of getUserMedia, if present
    let getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function (successCallback, errorCallback) {
      getUserMedia.call(navigator, constraints, successCallback, errorCallback);
    });
  }

  toggleCamera(dispatch) {
    if (!this.stream) {
      return navigator.mediaDevices.getUserMedia(this.constraints)
        .then(
          stream => {
            let videoTracks = stream.getVideoTracks();
            console.log('Using video device: ' + videoTracks[0].label);
            stream.onended = ()=> console.log('Stream ended');

            this.stream = stream;
            this._cameraElement.src = window.URL.createObjectURL(stream);
            this._cameraElement.onloadedmetadata = (event)=> {
              this._cameraElement.play();
            };
            this.props.newVideoStreamState(stream);
          },
          err => {
            throw err;
          }
        )
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.stream.getVideoTracks()[0].stop();
      this._cameraElement.pause();
      this._cameraElement.src = '';
      this.stream = null;
      this.props.newVideoStreamState(this.stream);

    }
  }

  render(){return null;}
}


const mapDispatchVideoCameraProps = (dispatch) => {
  return {
    newVideoComponentState: (element) =>{
      dispatch(toggleCameraVideoComponentState(element))
    },
    newVideoStreamState:(stream) =>{
      dispatch(toggleVideoCameraState(stream));
    }
  };
};

const mapStateVideoCameraProps = (state, ownProps) => {
  return {
    isLoading: state.videoCameraComponent
      .get(Parameters.isLoading)
  };
};

export default connect(mapStateVideoCameraProps, mapDispatchVideoCameraProps)(Camera);

