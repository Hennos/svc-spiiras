import {Events} from '../constants/user'

export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};

export const sendUserRequest = (userName) => {
  return {
    type: Events.emitUserRequest,
    userName
  }
};
export const sendRemovingRequest = (userName) => {
  return {
    type: Events.emitRejectionRequest,
    userName
  }
};
export const sendAddingRequest = (userName) => {
  return {
    type: Events.emitResolutionRequest,
    userName
  }
};
export const sendRemovingFriend = (userName) => {
  return {
    type: Events.emitRemovingFriend,
    userName
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

export const sendChangingPreferences = (changes) => {
  return {
    type: Events.emitChangePreferences,
    changes
  }
};
export const getNewUserPreferences = (changes) => {
  return {
    type: Events.getChangePreferences,
    changes
  }
};
export const setNewUserPreferences = (changes) => {
  return {
    type: Events.setChangePreferences,
    changes
  }
};
