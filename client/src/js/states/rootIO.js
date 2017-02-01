import Immutable from 'immutable'
import {RootIOConnection} from '../constants/rootIO'

export const state = Immutable.Map([
  [RootIOConnection.connection, null],
  [RootIOConnection.isConnected, false]  
]);
