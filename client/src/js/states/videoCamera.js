import Immutable from 'immutable'
import {Parameters} from '../constants/videoCamera'

export const state = Immutable.Map([
  [Parameters.isWorking, false],
  [Parameters.visible, true],
  [Parameters.isLoading, false]
]);
