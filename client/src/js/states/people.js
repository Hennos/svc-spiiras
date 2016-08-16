import Immutable from 'immutable';
import {people} from '../constants/people'

export const state = Immutable.Map([
  [people.valueInputSearchPeople, ''],
  [people.newSearchedPeople, Immutable.Set()]
]);
