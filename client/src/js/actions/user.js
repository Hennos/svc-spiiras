import {Events} from '../constants/user'

export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};

export const addFriendToUser = (friendName) => {
  return {
    type: Events.addFriendToUser,
    friendName
  }
};

export const removeFriendFromUser = (friendName) => {
  return {
    type: Events.removeFriendFromUser,
    friendName
  }
};
