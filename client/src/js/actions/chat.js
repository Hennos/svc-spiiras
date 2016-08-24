import {Events} from '../constants/chat'

export const addSideToChat = (side) => {
  return {
    type: Events.addSide,
    side
  }
};

export const startConference = () => {
  return {
    type: Events.startConference
  }
};

export const closeConference = () => {
  return {
    type: Events.closeConference
  }
};

export const emitAddSideToChat = (side) => {
  return {
    type: Events.emitAddingFriend,
    side
  }
};

export const emitCloseConference = () => {
  return {
    type: Events.emitCloseConference
  }
};
