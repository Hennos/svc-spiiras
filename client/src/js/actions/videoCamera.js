import {Events} from '../constants/videoCamera'

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

export const toggleCameraVideoComponentState = (element) => {
  return {
    type: Events.toggleCameraVideoElementState,
    element
  }
};

export const toggleCameraCanvasComponentState = (element) => {
  return {
    type: Events.toggleCameraCanvasElementState,
    element
  }
};
