import {Events} from '../constants/userPreferences'
import {newuser} from '../constants/userPreferences'
import {user} from '../constants/user'
import {state as initialState} from '../states/userPreferences'

const userPreferencesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.userChangePreferenses:
     return state.merge(Immutable.Map(newuser));

       default:
      return state;
  }
};

export default peopleReducer;
