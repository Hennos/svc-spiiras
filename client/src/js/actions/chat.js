import {Events} from '../constants/chat'

export const addSidesToConference = (sides) => {
  return {
    type: Events.addSides,
    sides
  }
};

export const removeSideFromConference = (sideName) => {
  return {
    type: Events.removeSide,
    sideName
  }
};

export const closeConference = () => {
  return {
    type: Events.closeConference
  }
};

export const openedConference = () => {
  return {
    type: Events.openedConference
  }
};

export const getUserStreamURL = (url) => {
  return {
    type: Events.getUserStreamURL,
    url: url
  }
};

export const emitAddSideToChat = (side) => {
  return {
    type: Events.emitAddedSide,
    side
  }
};

export const emitCloseConference = () => {
  return {
    type: Events.emitCloseConference
  }
};
