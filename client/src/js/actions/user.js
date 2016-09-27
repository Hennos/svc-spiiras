import {Events} from '../constants/user'

export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};

export const sendingUserRequest = (user) => {
  return {
    type: Events.emitUserRequest,
    user
  }
};
export const sendingRemovingRequest = (user) => {
  return {
    type: Events.emitRemovingRequest,
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

export const addedUserRequest = (user) => {
  return {
    type: Events.addRequestToUser,
    user
  }
};
export const removedUserRequest = (user) => {
  return {
    type: Events.removeRequestFromUser,
    user
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
