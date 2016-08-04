import Immutable from 'immutable'
import {user} from '../constants/user'

export const state = Immutable.Map([
  [user.username, null],
  [user.place, ''],
  [user.firstName, ''],
  [user.lastName, ''],
  [user.image, undefined],
  [user.friends, []]
]);
