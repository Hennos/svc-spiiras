import Immutable from 'immutable';
import {Events, user} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      let user = action.user;
      user.friends = Immutable.fromJS(user.friends);
      return state.merge(Immutable.Map(action.user));
    case Events.addFriendToUser:
      debugger;
      break;
    case Events.removeFriendFromUser:
      break;
    default:
      return state;
  }
};

export default userReducer;
