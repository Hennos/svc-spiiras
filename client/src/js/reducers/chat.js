import Immutable from 'immutable'
import {Events, chat} from '../constants/chat'
import {state as initialState} from '../states/chat'

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.addSides:
      return handleAddingSides(state, action);
    case Events.removeSide:
      return handleRemovingSide(state, action);
    case Events.closeConference:
      return handleCloseConference(state, action);
    default:
      return state;
  }
};

function handleAddingSides(state, action) {
  const addingSides = Immutable.Map(
    action.sides.map(side => [side.username, side])
  );
  const updatedSides = state
    .get(chat.sides)
    .merge(addingSides);
  return state
    .set(chat.sides, updatedSides);
}

function handleRemovingSide(state, action) {
  const side = action.sideName;
  const updatedSides = state
    .get(chat.sides)
    .delete(side);
  return state
    .set(chat.sides, updatedSides);
}

function handleCloseConference(state, action) {
  const updatedSides = state
    .get(chat.sides)
    .clear();
  return state
    .set(chat.sides, updatedSides)
}

export default chatReducer;
