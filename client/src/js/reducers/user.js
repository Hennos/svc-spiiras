import Immutable from 'immutable';
import {Events, user as userFields} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      action.user.friends = Immutable.Set(action.user.friends);
      return state.merge(Immutable.Map(action.user));
    case Events.addFriendToUser:
      const friendsWithAdding = state
        .get(userFields.friends)
        .add({username: action.friendName});
      return state.set(userFields.friends, friendsWithAdding);
    case Events.removeFriendFromUser:
      const friendsWithRemoving = state
        .get(userFields.friends)
        .delete({username: action.friendName});
      return state.set(userFields.friends, friendsWithRemoving);
    default:
      return state;
  }
};

export default userReducer;
