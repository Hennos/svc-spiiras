import {Events} from '../constants/userPreferences'

export const userChangePreferenses = (object) => {
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
export const userPreferencesSetValue = (object) => {
  return {
    type: Events.userPreferencesSetValue,
    object
  }
};
