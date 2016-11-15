import Immutable from 'immutable'
import {user as userFields} from '../constants/user'

export const state = Immutable.Map([
  [userFields.username, null],
  [userFields.image, null],
  [userFields.admined, Immutable.Set()],
  [userFields.requests, Immutable.Map()],
  [userFields.friends, Immutable.Map()],
  [userFields.status.id, Immutable.Map(
    Object.keys(userFields.status.fields)
      .map((elem) => {
        return [elem, null];
      })
  )]
]);
