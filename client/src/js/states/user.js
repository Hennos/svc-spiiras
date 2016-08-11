import Immutable from 'immutable'
import {user as userField, userRequest} from '../constants/user'

export const state = Immutable.Map([
  [userField.username, null],
  [userField.place, null],
  [userField.firstName, null],
  [userField.lastName, null],
  [userField.image, null],
  [userField.friends, Immutable.Set()],
  [userRequest.addingFriend, null],
  [userRequest.removingFriend, null]
]);
