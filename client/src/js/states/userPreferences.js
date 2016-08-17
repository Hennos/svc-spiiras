import Immutable from 'immutable'
import {user as userFields} from '../constants/user'
import {newuser as newuserFields} from '../constants/userPreferences'
export const state = Immutable.Map([
  [newuserFields.username, null],
  [newuserFields.place, null],
  [newuserFields.firstName, null],
  [newuserFields.lastName, null],
  [newuserFields.image, null],
  [newuserFields.middleName, null],
  [newuserFields.university, null],
  [newuserFields.school, null],
  [newuserFields.workplace, null]



]);
