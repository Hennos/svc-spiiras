import Immutable from 'immutable';
import {Events, user} from '../constants/user'
import {state as initialState} from '../states/user'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newUserData:
      return state.merge(Immutable.Map(action.user));
    default:
      return state;
  }
};

export default userReducer;
