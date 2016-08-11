import Immutable from 'immutable';
import {Events, user as userFields, userRequest} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      return handleUpdateUserAction(state, action);
    case Events.addFriendToUser:
      return handleAddFriendAction(state, action);
    case Events.removeFriendFromUser:
      return handleRemoveFriendAction(state, action);
    default:
      return state;
  }
};

function handleUpdateUserAction(state, action) {
  let updatedUser = action.user;
  updatedUser[userFields.friends] = Immutable.Set(updatedUser[userFields.friends]);
  updatedUser[userRequest.addingFriend] = null;
  updatedUser[userRequest.removingFriend] = null;
  return state.merge(Immutable.Map(updatedUser));
}

function handleAddFriendAction(state, action) {
  return state
    .set(userRequest.addingFriend, action.friend[userFields.username]);
}

function handleRemoveFriendAction(state, action) {
  return state
    .set(userRequest.removingFriend, action.friend[userFields.username]);
}

export default userReducer;
