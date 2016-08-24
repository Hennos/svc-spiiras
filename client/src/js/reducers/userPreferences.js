import {Events} from '../constants/userPreferences'
import {user} from '../constants/user'
import {values} from '../constants/userPreferences'
import {state as initialState} from '../states/userPreferences'
import Immutable from 'immutable';

const userPreferencesReducer = (state = initialState, action) => {

  switch (action.type) {
    case Events.userPreferencesSetValue:
      console.log('userPreferencesSetValue')
      switch (action.name){
         case 'place':
           return state.set(values.place, action.val)
         case   'firstName':
           return state.set(values.firstName, action.val)
         case 'lastName':
           return state.set(values.place, action.val)
         case 'middleName':
           return state.set(values.middleName, action.val)
         case 'country':
           return state.set(values.country, action.val)
         case 'university':
           return state.set(values.university, action.val)
         case 'school':
           return state.set(values.school, action.val)
         case 'workplace':
           return state.set(values.workplace, action.val)
      }

    case Events.userSetPreferences:
      console.log('state');
      console.log(action);
      return state.set(user, action);
       default:
      return state;
  }
};

export default userPreferencesReducer;
