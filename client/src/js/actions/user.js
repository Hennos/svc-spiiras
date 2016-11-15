import {Events} from '../constants/user'

export const setUserProperties = (user) => {
  return {
    type: Events.newUserData,
    user
  }
};

export const sendingUserRequest = (userName) => {
  return {
    type: Events.emitUserRequest,
    userName
  }
};
export const sendingRemovingRequest = (userName) => {
  return {
    type: Events.emitRejectionRequest,
    userName
  }
};
export const sendingAddingRequest = (userName) => {
  return {
    type: Events.emitResolutionRequest,
    userName
  }
};
export const sendingRemovingFriend = (userName) => {
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
