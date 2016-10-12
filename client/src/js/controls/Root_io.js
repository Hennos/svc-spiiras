import {Events as EventsUser} from '../constants/user'
import {Events as EventsPeople} from '../constants/people'
import {Events as EventsChat} from '../constants/chat'
import {Events as EventsVideoCamera} from '../constants/videoCamera'
import {Stream} from '../constants/videoCamera'
import io from 'socket.io-client'
import _ from 'lodash'
import {
  setUserProperties,
  addedUserRequest,
  addedUserFriend, removedUserRequest,
  removedUserFriend
} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'
import {
  addSidesToConference, removeSideFromConference,
  closeConference
} from '../actions/chat'

import PtPController from './P2PController'

class Root {
  constructor() {
    this.searchPeopleInput = '';
  }

  setConnection = (address, store) => {
    this.store = store;

    this.connection = io(address, {reconnection: false});
    this.connection.on(EventsUser.connected, this.afterConnection);
    this.connection.on(EventsUser.disconnected, this.afterDisconnection);
    this.connection.on(EventsUser.newUserData, this.newUserData);
    this.connection.on(EventsUser.addRequestToUser, this.updateAfterAddingRequest);
    this.connection.on(EventsUser.removeRequestFromUser, this.updateAfterRemovingRequest);
    this.connection.on(EventsUser.addFriendToUser, this.updateAfterAddingFriend);
    this.connection.on(EventsUser.removeFriendFromUser, this.updateAfterRemovingFriend);
    this.connection.on(EventsPeople.changeSearchedPeople, this.updateSearchedPeople);
    this.connection.on(EventsChat.addSides, this.pushSidesToConference);
    this.connection.on(EventsChat.removeSide, this.eraseSideFromConference);

    this.peerConnector = new PtPController(this.connection);
  };

  changeEmitterMiddleware = ({getStore, dispatch}) => next => action => {
    switch (action.type) {
      case EventsPeople.emitSearchPeopleInputChange:
        this.emitChangeInputValueEvent(action.type, action.value);
        break;
      case EventsUser.emitUserRequest:
        this.emitFriendRequestEvent(action.type, action.user);
        break;
      case EventsUser.emitResolutionRequest:
      case EventsUser.emitRejectionRequest:
        this.emitRequestAnswerEvent(action.type, action.user);
        break;
      case EventsUser.emitRemovingFriend:
        this.emitRemoveFriendEvent(action.type, action.user);
        break;
      case EventsChat.emitAddedSide:
        this.emitAddedSideEvent(action.type, action.side);
        break;
      case EventsChat.emitCloseConference:
        this.emitCloseConferenceEvent(action.type);
        break;
    }
    return next(action);
  };

  getterMiddleware = ({getStore, dispatch}) => next => action => {
    switch (action.type) {
      case EventsVideoCamera.toggleCameraState:
        this.peerConnector.setLocalStream(action.stream);
        break
    }
    return next(action);
  };

  afterConnection = () => {
    console.log('connected');
    this.getUserData();
  };

  afterDisconnection = () => {
    this.store.dispatch(closeConference());
    this.peerConnector.closeClientConnections();
    console.log('disconnect')
  };

  newUserData = (user) => {
    this.store.dispatch(setUserProperties(user));
  };

  getUserData = () => {
    this.connection.emit(EventsUser.getUserData);
  };

  updateAfterAddingRequest = (user) => {
    this.store.dispatch(newSearchedPeople([]));
    this.store.dispatch(addedUserRequest(user));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  updateAfterRemovingRequest = (requesting) => {
    this.store.dispatch(removedUserRequest(requesting));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  updateAfterAddingFriend = (friend) => {
    this.store.dispatch(addedUserFriend(friend));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  updateAfterRemovingFriend = (friend) => {
    this.store.dispatch(removedUserFriend(friend));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  updateSearchedPeople = (people) => {
    this.store.dispatch(newSearchedPeople(people));
  };

  pushSidesToConference = (sides) => {
    this.store.dispatch(addSidesToConference(sides));
  };

  eraseSideFromConference = (sideName) => {
    this.peerConnector.closeClientConnections();
    this.store.dispatch(removeSideFromConference(sideName));
  };

  emitChangeInputValueEvent = (type, value) => {
    this.connection.emit(type, value);
    this.searchPeopleInput = value;
  };

  emitFriendRequestEvent = (type, friendName) => {
    this.connection.emit(type, friendName);
  };

  emitRequestAnswerEvent = (type, userName) => {
    this.connection.emit(type, userName);
  };

  emitRemoveFriendEvent = (type, friendName) => {
    this.connection.emit(type, friendName);
  };

  emitAddedSideEvent = (type, sideName) => {
    this.connection.emit(type, sideName);
  };

  emitCloseConferenceEvent = (type) => {
    this.peerConnector.closeClientConnections();
    this.store.dispatch(closeConference());
    this.connection.emit(type);
  };
}

export default Root;
