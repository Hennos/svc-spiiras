import {toggleVideoCameraState} from '../actions/videoCamera'

'use strict';

class Camera {

  constructor({videoID, constraints}) {


    // for old browsers
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = this.promisifiedOldGUM;
    }

    //constrants of camera
    this.videoID = videoID;
    this.videoArea = null;
    this.constraints = constraints;
  }

  promisifiedOldGUM(constraints, successCallback, errorCallback) {

    // First get ahold of getUserMedia, if present
    let getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia);

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


  createToggleDispatcher () {
    let that = this;
    return function (dispatch) {
      return that.toggleCamera(dispatch)
    };
  }

  toggleCamera(dispatch) {

    if (!this.stream) {
      return navigator.mediaDevices.getUserMedia(this.constraints).then(
        stream => {
          let videoTracks = stream.getVideoTracks();
          if (!this.videoArea)
            this.videoArea = document.getElementById(this.videoID);


          console.log('Using video device: ' + videoTracks[0].label);
          stream.onended = ()=> console.log('Stream ended');

          this.stream = stream;
          this.videoArea.src = window.URL.createObjectURL(stream);
          this.videoArea.onloadedmetadata = (e)=> {
            this.videoArea.play();
          };

          if (dispatch) dispatch(toggleVideoCameraState());

        },
        error => console.log(error)
      );
    } else {
      this.videoArea.pause();
      this.videoArea.src = '';
      this.stream.getVideoTracks()[0].stop();
      this.stream = null;
      if (dispatch) dispatch(toggleVideoCameraState());
    }

  }

}

export default Camera;


