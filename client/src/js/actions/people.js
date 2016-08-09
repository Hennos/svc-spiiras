import {Events} from '../constants/people'

export const setInputSearchPeopleValue = (value) => {
  return {
    type: Events.changePatternSearchPeople,
    value
  }
};

export const newSearchedPeople = (people) => {
  return {
    type: Events.changePeople,
    people
  }
};
