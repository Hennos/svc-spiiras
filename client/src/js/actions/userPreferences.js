import {Events} from '../constants/userPreferences'

export const userChangePreferences = (object) => {
  return {
    type: Events.userChangePreferenсes,
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
