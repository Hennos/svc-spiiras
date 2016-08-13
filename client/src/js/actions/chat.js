import {Events} from '../constants/chat'

export const addNewSideToChat = (side) => {
  return {
    type: Events.addSide,
    side
  }
};

export const removeOldSideFromChat = (side) => {
  return {
    type: Events.removeSide,
    side
  }
};

export const closeChatConference = () => {
  return {
    type: Events.closeConference
  }
};
