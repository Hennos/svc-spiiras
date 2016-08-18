import {Events} from '../constants/people'

export const gettingSearchPeopleInput = (value) => {
  return {
    type: Events.emitSearchPeopleInputChange,
    value
  }
};

export const newSearchedPeople = (people) => {
  return {
    type: Events.changeSearchedPeople,
    people
  }
};
