import {Events} from '../constants/user'

export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};

export const addFriendToUserOnClient = (friendName) => {
  return {
    type: Events.addFriendToUserOnClient,
    friendName
  }
};

export const removeFriendFromUserOnClient = (friendName) => {
  return {
    type: Events.removeFriendFromUserOnClient,
    friendName
  }
};

export const addFriendToUserOnServer = (friend) => {
  return {
    type: Events.addFriendToUserOnServer,
    friend
  }
};

export const removeFriendFromUserOnServer = (friend) => {
  return {
    type: Events.removeFriendFromUserOnServer,
    friend
  }
};
