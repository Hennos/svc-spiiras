import io from 'socket.io-client'

import {Events as EventsUser} from '../constants/user'
import {Events as EventsPeople} from '../constants/people'
import {Events as EventsChat} from '../constants/chat'
import {Events as EventsVideoCamera} from '../constants/videoCamera'
import {Events as EventsAdminAccount} from '../constants/adminAccount'
import {Stream} from '../constants/videoCamera'

import {
  setUserProperties,
  addedUserRequest,
  addedUserFriend, removedUserRequest,
  removedUserFriend,
  getNewUserPreferences,
  setNewUserPreferences
} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'
import {adminAccountChangePreferences,adminAccountSetPreferences} from '../actions/adminAccount'
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
    this.connection.on(EventsUser.getChangePreferences, this.sendChangeUserPreferences);
    this.connection.on(EventsPeople.changeSearchedPeople, this.updateSearchedPeople);
    this.connection.on(EventsAdminAccount.adminAccountSetPreferences, this.adminAccountSetPreferences);
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
        this.emitFriendRequestEvent(action.type, action.userName);
        break;
      case EventsUser.emitResolutionRequest:
      case EventsUser.emitRejectionRequest:
        this.emitRequestAnswerEvent(action.type, action.userName);
        break;
      case EventsUser.emitRemovingFriend:
        this.emitRemoveFriendEvent(action.type, action.userName);
        break;
      case EventsUser.emitChangePreferences:
        console.log(action.changes);
        this.emitUserChangePreferences(action.type, action.changes);
        break;
        case EventsAdminAccount.adminAccountChangePreferences:
          console.log(action.type);
          console.log(action.object);
          this.emitAccountChangePreferenses(action.type, action.object);
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

  newUserData = (data) => {
    const user = JSON.parse(data);
    this.store.dispatch(setUserProperties(user));
    this.store.dispatch(getNewUserPreferences(user));
  };

  getUserData = () => {
    this.connection.emit(EventsUser.getUserData);
  };

  updateAfterAddingRequest = (data) => {
    const requesting = JSON.parse(data);
    this.store.dispatch(newSearchedPeople([]));
    this.store.dispatch(addedUserRequest(requesting));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  updateAfterRemovingRequest = (data) => {
    const requestingName = JSON.parse(data);
    this.store.dispatch(removedUserRequest(requestingName));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  adminAccountSetPreferences = (data) => {
    console.log(data);
    this.store.dispatch(adminAccountSetPreferences(data));
    this.getUserData();
  };

  updateAfterAddingFriend = (data) => {
    const friend = JSON.parse(data);
    this.store.dispatch(addedUserFriend(friend));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  updateAfterRemovingFriend = (data) => {
    const friendName = JSON.parse(data);
    this.store.dispatch(removedUserFriend(friendName));
    this.emitChangeInputValueEvent(
      EventsPeople.emitSearchPeopleInputChange,
      this.searchPeopleInput
    );
  };

  sendChangeUserPreferences = (data) => {
    const changes = JSON.parse(data);
    this.store.dispatch(setNewUserPreferences(changes));
  };

  updateSearchedPeople = (data) => {
    const people = JSON.parse(data);
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
    const message = JSON.stringify(value);
    this.connection.emit(type, message);
    this.searchPeopleInput = value;
  };

  emitFriendRequestEvent = (type, friendName) => {
    const message = JSON.stringify(friendName);
    this.connection.emit(type, message);
  };

  emitRequestAnswerEvent = (type, userName) => {
    const message = JSON.stringify(userName);
    this.connection.emit(type, message);
  };

  emitRemoveFriendEvent = (type, friendName) => {
    const message = JSON.stringify(friendName);
    this.connection.emit(type, message);
  };

  emitUserChangePreferences = (type, changes) => {
    const message = JSON.stringify(changes);
    this.connection.emit(type, message)
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
