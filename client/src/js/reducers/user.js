import Immutable from 'immutable';
import {Events, user as userFields} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      return handleUpdateUserAction(state, action);
    case Events.addFriendToUser:
      return handleAddingFriendAction(state, action);
    case Events.removeFriendFromUser:
      return handleRemovingFriendAction(state,action);
    default:
      return state;
  }
};

function handleUpdateUserAction(state, action) {
  let updatedUser = action.user;
  updatedUser.friends = Immutable.Set(updatedUser.friends);
  return state.merge(Immutable.Map(updatedUser));
}

function handleAddingFriendAction(state, action) {
  const updatedFriends = state
    .get(userFields.friends)
    .add(action.friend);
  return state
    .set(userFields.friends, updatedFriends)
}

function handleRemovingFriendAction(state, action) {
  let updatedFriends = state
    .get(userFields.friends)
    .filter((friend) => {
      return friend.username !== action.friend.username;
    });
  return state
    .set(userFields.friends, updatedFriends)
}

export default userReducer;
