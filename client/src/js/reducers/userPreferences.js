import {Events} from '../constants/userPreferences'
import {newuser} from '../constants/userPreferences'
import {user} from '../constants/user'
import {state as initialState} from '../states/userPreferences'
import Immutable from 'immutable';

const userPreferencesReducer = (state = initialState, action) => {

  switch (action.type) {
    case Events.userChangePreferenses:
      console.log(state);
     return state.merge(Immutable.Map(newuser));
    case Events.userSetPreferences:
      return state.set(user, action.user);
       default:
      return state;
  }
};

export default userPreferencesReducer;
