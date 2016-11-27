import Immutable from 'immutable';
import {adminAccount} from '../constants/adminAccount'

export const state = Immutable.Map([
  [adminAccount.admined, Immutable.Map()]
]);
