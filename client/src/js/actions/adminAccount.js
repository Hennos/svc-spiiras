import {Events} from '../constants/adminAccount'

export const adminAccountChangePreferenses = (object) => {
  console.log(object);
  return {
    type: Events.adminAccountChangePreferenses,
    object
  }
};
export const adminAccountSetPreferences = (string) => {
  return {
    type: Events.adminAccountSetPreferences,
    string
  }
};

