import {Events} from '../constants/videoMixer'

export const newCanvasMixer = (element) => {
  return {
    type: Events.newCanvasMixer,
    element
  }
};
