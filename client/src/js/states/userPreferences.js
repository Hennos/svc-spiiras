import Immutable from 'immutable'
import {user as userFields} from '../constants/user'
import {userPrefsValues as valuseFields} from '../constants/userPreferences'
export const state = Immutable.Map([

  [valuseFields.firstName, userFields.firstName],
  [valuseFields.lastName, userFields.lastName],
  [valuseFields.middleName, userFields.middleName],
  [valuseFields.country, userFields.country],
  [valuseFields.place, userFields.place],
  [valuseFields.university, userFields.university],
  [valuseFields.school, userFields.school],
  [valuseFields.workplace, userFields.workplace]
]);
