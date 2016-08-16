import {Events} from '../constants/userPreferences'

export const userChangePreferenses = (object) => {
  return {
    type: Events.userChangePreferenses,
    object
  }
};

