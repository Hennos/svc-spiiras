import {TOGGLE_VIDEO_CAMERA_STATE, VIDEO_CAMERA_LOADING}from '../constants/videoCamera'

export const toggleVideoCameraState = () => {
  return {
    type: TOGGLE_VIDEO_CAMERA_STATE
  }
};

export const loadVideoCamera = () => {
  return {
    type: VIDEO_CAMERA_LOADING
  }
};
