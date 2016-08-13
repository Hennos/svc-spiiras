import {Events, chat} from '../constants/chat'
import {state as initialState} from '../states/chat'

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.addSide:
      return state;
    case Events.removeSide:
      return state;
    case Events.closeConference:
      return state;
    default:
      return state;
  }
};

export default chatReducer;
