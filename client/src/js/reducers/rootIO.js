import Immutable from 'immutable';

import {Events, RootIOConnection} from '../constants/rootIO'


import {state as initialState} from '../states/rootIO'

const rootIOtReducer = (state = initialState, action) => {
  switch (action.type) {
    case Events.newConnectionState:
      return handleNewConnectionState(state, action);
    case Events.newConnectionObject:
      return handleNewConnectionObject(state, action);
    default:
      return state;
  }
};

function handleNewConnectionState(state, action) {
  return state.set(RootIOConnection.isConnected, action.value);
}

function handleNewConnectionObject(state, action) {
  return state.set(RootIOConnection.connection, action.value);
}

export default rootIOtReducer;
