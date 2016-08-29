import {Events} from '../constants/chat'

export const addSidesToChat = (sides) => {
  return {
    type: Events.addSides,
    sides
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
