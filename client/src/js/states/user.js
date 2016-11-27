import Immutable from 'immutable'
import {user as userFields} from '../constants/user'

export const state = Immutable.Map([
  [userFields.admin, false],
  [userFields.username, null],
  [userFields.image, null],
  [userFields.requests, Immutable.Map()],
  [userFields.friends, Immutable.Map()],
  [userFields.preferences.id, Immutable.Map(
    Object.keys(userFields.preferences.fields)
      .map(elem => [elem, null])
  )],
  [userFields.permission.id, Immutable.Map(
    Object.keys(userFields.permission.fields)
      .map(option => [option, true])
  )]
]);
