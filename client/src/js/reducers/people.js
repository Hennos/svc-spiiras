import {Events, people} from '../constants/people'
import {state as initialState} from '../states/people'

const peopleReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.changeValueInputSearchPeople:
      return state.set(people.valueInputSearchPeople, action.value);
    case Events.changePeople:
      return state.set(people.newSearchedPeople, action.people);
    default:
      return state;
  }
};

export default peopleReducer;
