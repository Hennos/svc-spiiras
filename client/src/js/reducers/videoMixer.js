import {Events, VideoMixer} from '../constants/videoMixer'
import {state as initialState} from '../states/videoMixer'

const videoMixerReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newCanvasMixer:
      return handleNewCanvasMixer(state, action);
    default:
      return state;
  }
};

function handleNewCanvasMixer(state, action) {
  return state
    .set(VideoMixer.element, action.element);
}

export default videoMixerReducer;
