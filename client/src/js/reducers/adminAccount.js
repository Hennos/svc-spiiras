import {Events} from '../constants/adminAccount'
import {changeuserfromadmin} from '../constants/adminAccount'

//import {state as initialState} from '../states/adminAccount'
import Immutable from 'immutable';

const adminAccountReducer = (state = initialState, action) => {

  switch (action.type) {
    case Events.adminAccountSetPreferences:
      return state.set(user, action.user);
       default:
      return state;
  }
};

export default adminAccountReducer;
