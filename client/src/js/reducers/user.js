import Immutable from 'immutable';
import {Events, user as userFields, updatedUserFriend} from '../constants/user'
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
  updatedUser.friends = Immutable.Set(action.user.friends);
  return state.merge(Immutable.Map(updatedUser));
}

function handleAddFriendAction(state, action) {
  const friendsWithAdding = state
    .get(userFields.friends)
    .add(action.friend);
  return state
    .set(userFields.friends, friendsWithAdding)
    .set(updatedUserFriend, action.friend.username);
}

function handleRemoveFriendAction(state, action) {
  const friendsWithoutRemoving = state
    .get(userFields.friends)
    .filterNot((friend) => {
      return Object.is(friend.username, action.friend.username)
    });
  return state
    .set(userFields.friends, friendsWithoutRemoving)
    .set(updatedUserFriend, action.friend.username);
}

export default userReducer;
