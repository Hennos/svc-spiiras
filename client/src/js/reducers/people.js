import Immutable from 'immutable'
import {Events, people} from '../constants/people'
import {state as initialState} from '../states/people'

const peopleReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.changePatternSearchPeople:
      return handleChangingSearchPatter(state, action);
    case Events.changePeople:
      return handleUpdateFoundPeople(state, action);
    default:
      return state;
  }
};

function handleChangingSearchPatter(state, action) {
  return state.set(people.valueInputSearchPeople, action.value);
}

function handleUpdateFoundPeople(state, action) {
  const foundPeople = Immutable.Set(action.people);
  return state
    .set(people.newSearchedPeople, foundPeople);
}

export default peopleReducer;
