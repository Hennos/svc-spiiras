import Immutable from 'immutable'
import {user as userFields, userRequests} from '../constants/user'

export const state = Immutable.Map([
  [userFields.username, null],
  [userFields.place, null],
  [userFields.firstName, null],
  [userFields.lastName, null],
  [userFields.image, null],
  [userFields.middleName, null],
  [userFields.university, null],
  [userFields.school, null],
  [userFields.workplace, null],
  [userFields.friends, Immutable.Set()],
  [userRequests.addingFriend, null],
  [userRequests.removingFriend, null]
]);
