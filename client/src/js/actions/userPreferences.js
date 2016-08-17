import {Events} from '../constants/userPreferences'

export const userChangePreferenses = (object) => {
  console.log(object);
  return {
    type: Events.userChangePreferenses,
    object
  }
};
export const userSetPreferences = (object) => {
  return {
    type: Events.userSetPreferences,
    object
  }
};
