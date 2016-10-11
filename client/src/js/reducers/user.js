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
    default:
      return state;
  }
};

function handleUpdateUser(state, action) {
  let updatedUser = action.user;
  updatedUser.friends = Immutable.Set(updatedUser.friends);
  updatedUser.requests = Immutable.Set(updatedUser.requests);
  return state.merge(Immutable.Map(updatedUser));
}

function handleUserRequest(state, action) {
  const upRequests = state
    .get(userFields.requests)
    .add(action.user);
  return state
    .set(userFields.requests, upRequests);
}
function handleAddingFriend(state, action) {
  const upFriends = state
    .get(userFields.friends)
    .add(action.user);
  const upRequests  = state
    .get(userFields.requests)
    .filterNot(Object.is.bind(null, action.user));
  return state
    .set(userFields.friends, upFriends)
    .set(userFields.requests, upRequests);
}

function handleRemovingUserRequest(state, action) {
  let upRequests = state
    .get(userFields.requests)
    .filterNot(Object.is.bind(null, action.user));
  return state
    .set(userFields.requests, upRequests);
}
function handleRemovingFriend(state, action) {
  let updatedFriends = state
    .get(userFields.friends)
    .filterNot(Object.is.bind(null, action.user));
  return state
    .set(userFields.friends, updatedFriends);
}

export default userReducer;
