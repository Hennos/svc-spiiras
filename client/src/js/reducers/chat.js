import {Events, chat} from '../constants/chat'
import {state as initialState} from '../states/chat'

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.addSide:
      return handleAddingSide(state, action);
    case Events.closeConference:
      return handleCloseConference(state, action);
    default:
      return state;
  }
};

function handleAddingSide(state, action) {
  const updateSides = state
    .get(chat.sides)
    .set(action.side, {username: action.side});
  return state
    .set(chat.sides, updateSides);
}

function handleCloseConference(state, action) {
  const updateSides = state
    .get(chat.sides)
    .clear();
  return state
    .set(chat.sides, updateSides)
}

export default chatReducer;
