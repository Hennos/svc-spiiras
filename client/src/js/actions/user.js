import {Events} from '../constants/user'

export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};

export const sendingAddingFriend = (friend) => {
  return {
    type: Events.emitAddingFriend,
    friend
  }
};

export const sendingRemovingFriend = (friend) => {
  return {
    type: Events.emitRemovingFriend,
    friend
  }

};

export const addedUserFriend = (friend) => {
  return {
    type: Events.addFriendToUser,
    friend
  }
};

export const removedUserFriend = (friend) => {
  return {
    type: Events.removeFriendFromUser,
    friend
  }
};
