import Immutable from 'immutable';
import {result as result} from '../constants/adminAccount'
import {changeuserfromadmin as changeuserfromadmin} from '../constants/adminAccount'
export const state = Immutable.Map([

  [changeuserfromadmin.username, null],
  [changeuserfromadmin.password, null],
  [changeuserfromadmin.makecalls, false],
  [changeuserfromadmin.addingfriends, false],
  [changeuserfromadmin.forcedchallenge,false],
  [changeuserfromadmin.interactiveboard,false],
  [changeuserfromadmin.passwordexitprofile,false],
  [changeuserfromadmin.passwordmanipulationofaudiovideo,false],
  [result, '']
]);

