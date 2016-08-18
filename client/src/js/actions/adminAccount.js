import {Events} from '../constants/adminAccount'

export const adminAccountChangePreferenses = (object) => {
  console.log(object);
  return {
    type: Events.adminAccountChangePreferenses,
    object
  }
};
export const adminAccountSetPreferences = (object) => {
  return {
    type: Events.adminAccountSetPreferences,
    object
  }
};
