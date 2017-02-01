import Immutable from 'immutable'
import {Events, Chat} from '../constants/chat'
import {state as initialState} from '../states/chat'

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.addSides:
      return handleAddingSides(state, action);
    case Events.removeSide:
      return handleRemovingSide(state, action);
    case Events.getUserStreamURL:
      return handleUserStreamURL(state, action);
    case Events.closeConference:
      return handleCloseConference(state, action);
    case Events.openedConference:
      return handleOpenedConference(state, action);
    default:
      return state;
  }
};

function handleAddingSides(state, action) {
  const addingSides = Immutable.Map(
    action.sides.map(side => [side.username, side])
  );
  const updatedSides = state
    .get(Chat.sides)
    .merge(addingSides);
  return state
    .set(Chat.sides, updatedSides);
}

function handleUserStreamURL(state, action) {
  return state
    .set(Chat.url, action.url);
}

function handleRemovingSide(state, action) {
  const side = action.sideName;
  const updatedSides = state
    .get(Chat.sides)
    .delete(side);
  return state
    .set(Chat.sides, updatedSides);
}

function handleOpenedConference(state, action) {
  return state.set(Chat.isConferenceOpen, true);
}

function handleCloseConference(state, action) {
  const updatedSides = state
    .get(Chat.sides)
    .clear();

  return state
    .set(Chat.sides, updatedSides)
    .set(Chat.isConferenceOpen, false);
}

export default chatReducer;
