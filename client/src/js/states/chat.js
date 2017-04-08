import Immutable from 'immutable';
import {Chat} from '../constants/chat'


export const state = Immutable.Map([
  [Chat.sides, Immutable.Map()],
  [Chat.url, null],
  [Chat.isConferenceOpen, false]
]);
