import Immutable from 'immutable';
import {people} from '../constants/people'

export const state = Immutable.Map([
  [people.newSearchedPeople, Immutable.Set()]
]);
