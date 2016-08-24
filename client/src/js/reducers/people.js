import Immutable from 'immutable'
import {Events, people} from '../constants/people'
import {state as initialState} from '../states/people'

const peopleReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.changeSearchedPeople:
      return handleUpdateFoundPeople(state, action);
    default:
      return state;
  }
};

function handleUpdateFoundPeople(state, action) {
  const foundPeople = Immutable.Set(action.people);
  return state
    .set(people.newSearchedPeople, foundPeople);
}

export default peopleReducer;
