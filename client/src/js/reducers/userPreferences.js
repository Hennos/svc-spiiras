import {Events} from '../constants/userPreferences'
import {user} from '../constants/user'
import {userPrefsValues} from '../constants/userPreferences'
import {state as initialState} from '../states/userPreferences'
import Immutable from 'immutable';

const userPreferencesReducer = (state = initialState, action) => {

  switch (action.type) {
    case Events.userPreferencesSetValue:
      switch (action.object.name) {
        case   'firstName':
          return state.set(userPrefsValues.firstName, action.object.val);
          break;
        case 'lastName':
          return state.set(userPrefsValues.lastName, action.object.val);
          break;
        case 'middleName':
          return state.set(userPrefsValues.middleName, action.object.val);
          break;
        case 'country':
          return state.set(userPrefsValues.country, action.object.val);
          break;
        case 'place':
          return state.set(userPrefsValues.place, action.object.val);
          break;
        case 'university':
          return state.set(userPrefsValues.university, action.object.val);
          break;
        case 'school':
          return state.set(userPrefsValues.school, action.object.val);
          break;
        case 'workplace':
          return state.set(userPrefsValues.workplace, action.object.val);
          break;
      }
      break;

    case Events.userSetPreferences:
      var value = Object.assign({}, JSON.parse(JSON.stringify(userPrefsValues)));
      value.firstName = action.object.firstName;
      value.lastName = action.object.lastName;
      value.middleName = action.object.middleName;
      value.place = action.object.place;
      value.country = action.object.country;
      value.university = action.object.university;
      value.school = action.object.school;
      value.workplace = action.object.workplace;
      return state.merge(state.value, value);
    default:
      return state;
  }
};

export default userPreferencesReducer;
