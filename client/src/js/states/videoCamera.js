import Immutable from 'immutable'
import {Stream, Parameters} from '../constants/videoCamera'

export const state = Immutable.Map([
  [Stream.localStream, null],
  [Parameters.isWorking, false],
  [Parameters.visible, true],
  [Parameters.isLoading, false]
]);
