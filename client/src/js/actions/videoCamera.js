import {Events}from '../constants/videoCamera'

export const toggleVideoCameraState = (stream) => {
  return {
    type: Events.toggleCameraState,
    stream
  }
};

export const loadVideoCamera = () => {
  return {
    type: Events.videoCameraLoading
  }
};
