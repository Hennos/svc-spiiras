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
    type: Events.emitRejectionRequest,
    user
  }
};
export const sendingAddingRequest = (user) => {
  return {
    type: Events.emitResolutionRequest,
    user
  }
};
export const sendingRemovingFriend = (user) => {
  return {
    type: Events.emitRemovingFriend,
    user
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
export const addedUserFriend = (user) => {
  return {
    type: Events.addFriendToUser,
    user
  }
};
export const removedUserFriend = (user) => {
  return {
    type: Events.removeFriendFromUser,
    user
  }
};
