import {Events} from  '../constants/videoCamera';
import {Stream, Parameters, DOMElements} from  '../constants/videoCamera';
import {state as initialState} from '../states/videoCamera'

const videoCameraComponent = (state = initialState, action) => {
  switch (action.type) {
    case Events.videoCameraLoading:
      return handleVideoCameraLoading(state, action);
    case Events.toggleCameraState:
      return handleTogglingCameraState(state, action);
    case Events.toggleCameraVideoElementState:
          return handleTogglingCameraVideoElementState(state, action);
    case Events.toggleCameraCanvasElementState:
          return handleTogglingCameraCanvasElementState(state, action);
    default:
      return state;
  }
};

function handleVideoCameraLoading(state, action) {
  return state.set(Parameters.isLoading, !state.get(Parameters.isLoading));
}

function handleTogglingCameraVideoElementState(state, action) {
  return state.set(DOMElements.videoElement, action.element);
}

function handleTogglingCameraCanvasElementState(state, action) {
  return state.set(DOMElements.canvasElement, action.element);
}

function handleTogglingCameraState(state, action) {
  const condition = !state.get(Parameters.isWorking);
  let newState = state.set(Stream.localStream, (condition) ? action.stream : null);
  return newState.withMutations((ctx) => {
    ctx.set(Parameters.isLoading, false)
      .set(Parameters.isWorking, !state.get(Parameters.isWorking))
  });
}

export default videoCameraComponent;
