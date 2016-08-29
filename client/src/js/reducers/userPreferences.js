import {Events} from '../constants/userPreferences'
import {user} from '../constants/user'
import {userPrefsValues} from '../constants/userPreferences'
import {state as initialState} from '../states/userPreferences'
import Immutable from 'immutable';

const userPreferencesReducer = (state = initialState, action) => {
  console.log(userPrefsValues );
  switch (action.type) {
    case Events.userPreferencesSetValue:
      console.log(action.object.name);
      switch (action.object.name){
         case   'firstName':
           console.log(userPrefsValues.firstName);
           return state.set(userPrefsValues.firstName, action.object.val);
           break;
         case 'lastName':
           console.log(userPrefsValues.lastName);
           return state.set(userPrefsValues.lastName, action.object.val);
           break;
         case 'middleName':
           console.log('middleName');
           return state.set(userPrefsValues.middleName, action.object.val);
           break;
         case 'country':
           console.log('country');
           return state.set(userPrefsValues.country, action.object.val);
           break;
        case 'place':
          console.log('place')
          return state.set(userPrefsValues.place, action.object.val);
          break;
         case 'university':
           console.log('university');
           return state.set(userPrefsValues.university, action.object.val);
           break;
         case 'school':
           console.log('school');
           return state.set(userPrefsValues.school, action.object.val);
           break;
         case 'workplace':
           console.log('workplace');
           return state.set(userPrefsValues.workplace, action.object.val);
           break;

      }
      break;

    case Events.userSetPreferences:
      console.log(action);
      console.log('userSetPreferences');
      var  value = Object.assign({}, JSON.parse(JSON.stringify(userPrefsValues)));
      value.firstName=action.object.firstName;
      value.lastName=action.object.lastName;
      value.middleName=action.object.middleName;
      value.place=action.object.place;
      value.country=action.object.country;
      value.university=action.object.university;
      value.school=action.object.school ;
      value.workplace=action.object.workplace;
      console.log(value);
      return state.merge(state.value , value);
       default:
         //console.log('state')
      return state;
  }
};

export default userPreferencesReducer;
