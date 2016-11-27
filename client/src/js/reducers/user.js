import Immutable from 'immutable';
import {Events, user as userFields} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      return handleUpdateUser(state, action);
    case Events.addRequestToUser:
      return handleUserRequest(state, action);
    case Events.addFriendToUser:
      return handleAddingFriend(state, action);
    case Events.removeRequestFromUser:
      return handleRemovingUserRequest(state, action);
    case Events.removeFriendFromUser:
      return handleRemovingFriend(state,action);
    case Events.setChangePreferences:
      return handleSettingPreferences(state, action);
    default:
      return state;
  }
};

function handleUpdateUser(state, action) {
  let updatedUser = action.user;
  updatedUser.friends = Immutable.Map(updatedUser.friends);
  updatedUser.requests = Immutable.Map(updatedUser.requests);
  updatedUser.preferences =
    state.get(userFields.preferences.id)
      .merge(Immutable.Map(updatedUser.preferences));
  updatedUser.permission =
    state.get(userFields.permission.id)
      .merge(Immutable.Map(updatedUser.permission));
  return state.merge(Immutable.Map(updatedUser));
}

function handleUserRequest(state, action) {
  const reqUser = action.user;
  const upRequests = state
    .get(userFields.requests)
    .set(reqUser.username, reqUser);
  return state
    .set(userFields.requests, upRequests);
}
function handleAddingFriend(state, action) {
  const addedFriend = action.user;
  const upFriends = state
    .get(userFields.friends)
    .set(addedFriend.username, addedFriend);
  const upRequests  = state
    .get(userFields.requests)
    .delete(addedFriend.username);
  return state
    .set(userFields.friends, upFriends)
    .set(userFields.requests, upRequests);
}

function handleRemovingUserRequest(state, action) {
  const deletedFriend = action.user;
  let upRequests = state
    .get(userFields.requests)
    .delete(deletedFriend.username);
  return state
    .set(userFields.requests, upRequests);
}
function handleRemovingFriend(state, action) {
  const deletedRequest = action.user;
  let updatedFriends = state
    .get(userFields.friends)
    .delete(deletedRequest.username);
  return state
    .set(userFields.friends, updatedFriends);
}

function handleSettingPreferences(state, action) {
  const changesPreferences = Immutable.Map(action.changes);
  return state
    .set(userFields.preferences.id, changesPreferences);
}

export default userReducer;
