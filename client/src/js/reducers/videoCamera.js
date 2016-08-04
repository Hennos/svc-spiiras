import {TOGGLE_VIDEO_CAMERA_STATE, VIDEO_CAMERA_LOADING} from  '../constants/videoCamera';
import {Parameters} from  '../constants/videoCamera';
import {state as initialState} from '../states/videoCamera'

const videoCameraComponent = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_CAMERA_LOADING:
      console.log(VIDEO_CAMERA_LOADING);
      return state.set(Parameters.isLoading, !state.get(Parameters.isLoading));
    case TOGGLE_VIDEO_CAMERA_STATE:
      console.log(TOGGLE_VIDEO_CAMERA_STATE);
      return state.withMutations((ctx) => {
        ctx.set(Parameters.isLoading, false)
          .set(Parameters.isWorking, !state.get(Parameters.isWorking))
      });
    default:
      return state;
  }
};

export default videoCameraComponent;
