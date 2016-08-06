import Immutable from 'immutable';
import {people} from '../constants/people'

export const state = Immutable.Map([
  [people.valueInputSearchPeople, ''],
  [people.newSearchedPeople, []]
]);

//{ username: "antoni-fox", firstName:"Anton" , lastName:"Saveliev", place:"Kazan", image: 'http://placehold.it/120x120&text=image1' }
