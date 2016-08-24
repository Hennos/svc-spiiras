import Immutable from 'immutable';
import {chat} from '../constants/chat'

export const state = Immutable.Map([
  [chat.sides, Immutable.Map()],
  [chat.talking, false]
]);
