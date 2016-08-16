import Immutable from 'immutable';
import {Events, user as userFields, userRequests} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      return handleUpdateUserAction(state, action);
    case Events.addFriendToUserOnClient:
      return handleAddingFriendActionOnClient(state, action);
    case Events.removeFriendFromUserOnClient:
      return handleRemovingFriendActionOnClient(state, action);
    case Events.addFriendToUserOnServer:
      return handleAddingFriendActionOnServer(state, action);
    case Events.removeFriendFromUserOnServer:
      return handleRemovingFriendActionOnServer(state,action);
    default:
      return state;
  }
};

function handleUpdateUserAction(state, action) {
  let updatedUser = action.user;
  updatedUser[userFields.friends] = Immutable.Set(updatedUser[userFields.friends]);
  return state.merge(Immutable.Map(updatedUser));
}

function handleAddingFriendActionOnServer(state, action) {
  const updatedFriends = state
    .get(userFields.friends)
    .add(action.friend);
  return state
    .set(userFields.friends, updatedFriends)
    .set(userRequests.addingFriend, null);
}

function handleRemovingFriendActionOnServer(state, action) {
  let updatedFriends = state
    .get(userFields.friends)
    .filter((friend) => {
      return friend.username !== action.friend.username;
    });
  return state
    .set(userFields.friends, updatedFriends)
    .set(userRequests.removingFriend, null);
}

function handleAddingFriendActionOnClient(state, action) {
  return state
    .set(userRequests.addingFriend, action.friendName);
}

function handleRemovingFriendActionOnClient(state, action) {
  return state
    .set(userRequests.removingFriend, action.friendName);
}

export default userReducer;
