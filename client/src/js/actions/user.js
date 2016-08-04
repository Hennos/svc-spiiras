import {Events} from '../constants/user'


export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};
