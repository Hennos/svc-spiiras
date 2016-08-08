import Immutable from 'immutable'
import {user} from '../constants/user'

export const state = Immutable.Map([
  [user.username, null],
  [user.place, null],
  [user.firstName, null],
  [user.lastName, null],
  [user.image, null],
  [user.friends, []]
]);
