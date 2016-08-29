import {Events} from '../constants/chat'

export const addSideToChat = (side) => {
  return {
    type: Events.addSide,
    side
  }
};

export const closeConference = () => {
  return {
    type: Events.closeConference
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
