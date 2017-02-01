import {Events} from '../constants/rootIO'

export const newConnectionState = (value) => {
  return {
    type: Events.newConnectionState,
    value
  }
};

export const newConnectionObject = (value) => {
  return {
    type: Events.newConnectionObject,
    value
  }
};
