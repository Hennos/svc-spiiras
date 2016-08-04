import {Events} from '../constants/people'



export const setInputSearchPeopleValue = (value) => {
  return {
    type: Events.changeValueInputSearchPeople,
    value
  }
};

export const newSearchedPeople = (people) => {
  return {
    type: Events.newSearchedPeople,
    people
  }
};
