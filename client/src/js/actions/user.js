import {Events} from '../constants/user'

export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};

export const addFriendToUser = (friend) => {
  return {
    type: Events.addFriendToUser,
    friend
  }
};

export const removeFriendFromUser = (friend) => {
  return {
    type: Events.removeFriendFromUser,
    friend
  }
};
