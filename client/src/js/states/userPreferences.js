import Immutable from 'immutable'
import {user } from '../constants/user'
import {values} from '../constants/userPreferences'
export const state = Immutable.Map([
  [values.place, user.place],
  [values.firstName, user.firstName],
  [values.lastName, user.lastName],
  [values.middleName, user.middleName],
  [values.university, user.university],
  [values.school, user.school],
  [values.workplace, user.workplace]
]);
