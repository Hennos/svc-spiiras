import Immutable from 'immutable';
import {Events, user as userFields} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      let updatedUser = action.user;
      updatedUser.friends = Immutable.Set(action.user.friends);
      return state.merge(Immutable.Map(updatedUser));
    case Events.addFriendToUser:
      const friendsWithAdding = state
        .get(userFields.friends)
        .add(action.friend);
      return state.set(userFields.friends, friendsWithAdding);
    case Events.removeFriendFromUser:
      const friendsWithoutRemoving = state
        .get(userFields.friends)
        .filterNot((friend) => {
          return Object.is(friend.username, action.friend.username)
        });
      return state.set(userFields.friends, friendsWithoutRemoving);
    default:
      return state;
  }
};

export default userReducer;
