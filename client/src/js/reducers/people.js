import Immutable from 'immutable';
import {Events, people} from '../constants/people'


const peopleReducer = (state = Immutable.Map([
  [people.valueInputSearchPeople, ''],
  [people.newSearchedPeople, []]
]), action) => {

  switch (action.type) {

    case Events.changeValueInputSearchPeople:
      return state.set(people.valueInputSearchPeople, action.value);

    case Events.newSearchedPeople:
          return state.set(people.newSearchedPeople, action.people);

    default:
      return state;
  }
};

export default peopleReducer;
