import io from 'socket.io-client'

import {Events as EventsUser} from '../constants/user'
import {Events as EventsPeople} from '../constants/people'
import {Events as EventsChat} from '../constants/chat'
import {Events as EventsVideoCamera} from '../constants/videoCamera'
import {Events as EventsAdmin} from '../constants/adminAccount'
import {Stream} from '../constants/videoCamera'

import {
  setUserStatus,
  addedUserRequest,
  addedUserFriend, removedUserRequest,
  removedUserFriend,
  setNewUserPreferences
} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'
import {
  addCreatedCtrlAcc,
  deleteRemovedCtrlAcc,
  updateCtrlAccount,
  setAdminStatus
} from '../actions/adminAccount'
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
    this.connection.on(EventsUser.getUserUpdate, this.refreshUserData);

    this.connection.on(EventsUser.addRequestToUser, this.updateAfterAddingRequest);
    this.connection.on(EventsUser.removeRequestFromUser, this.updateAfterRemovingRequest);

    this.connection.on(EventsUser.addFriendToUser, this.updateAfterAddingFriend);
    this.connection.on(EventsUser.removeFriendFromUser, this.updateAfterRemovingFriend);

    this.connection.on(EventsUser.getChangePreferences, this.sendChangeUserPreferences);

    this.connection.on(EventsAdmin.getCreateCtrlAcc, this.sendCreatedCtrlAcc);
    this.connection.on(EventsAdmin.getRemoveCtrlAcc, this.sendRemovedCtrlAcc);
    this.connection.on(EventsAdmin.getUpdatedCtrlAccount, this.sendUpdatedCtrlAcc);

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
      case EventsUser.emitResolutionRequest:
      case EventsUser.emitRejectionRequest:
      case EventsUser.emitRemovingFriend:
        this.emitRelationsEvent(action.type, action.userName);
        break;
      case EventsUser.emitChangePreferences:
        console.log(action.changes);
        this.emitUserChangePreferences(action.type, action.changes);
        break;
      case EventsAdmin.emitCreateCtrlAccount:
        this.emitCreateAccount(action.type, action.object);
        break;
      case EventsAdmin.emitRemoveCtrlAccount:
        this.emitRemoveAccount(action.type, action.removing);
        break;
      case EventsAdmin.emitUpdateCtrlAccount:
        this.emitUpdateAccount(action.type, action.updating);
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
    const {admined, ...userStatus} = JSON.parse(data);
    const adminStatus = {admined};
    this.store.dispatch(setUserStatus(userStatus));
    this.store.dispatch(setAdminStatus(adminStatus));
  };

  refreshUserData = () => {
    console.log('refresh data');
    this.getUserData();
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

  sendAdminStatus = (data) => {
    const status = JSON.parse(data);
    this.store.dispatch(setAdminStatus(status));
  };

  sendCreatedCtrlAcc = (data) => {
    const account = JSON.parse(data);
    this.store.dispatch(addCreatedCtrlAcc(account));
  };

  sendRemovedCtrlAcc = (data) => {
    const removed = JSON.parse(data);
    this.store.dispatch(deleteRemovedCtrlAcc(removed));
  };

  sendUpdatedCtrlAcc = (data) => {
    const updated = JSON.parse(data);
    this.store.dispatch(updateCtrlAccount(updated));
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

  emitRelationsEvent = (type, userName) => {
    const message = JSON.stringify(userName);
    this.connection.emit(type, message);
  };

  emitUserChangePreferences = (type, changes) => {
    const message = JSON.stringify(changes);
    this.connection.emit(type, message)
  };

  emitCreateAccount = (type, status) => {
    const message = JSON.stringify(status);
    this.connection.emit(type, message);
  };

  emitRemoveAccount = (type, nameAcc) => {
    const message = JSON.stringify(nameAcc);
    this.connection.emit(type, message);
  };

  emitUpdateAccount = (type, updating) => {
    const message = JSON.stringify(updating);
    this.connection.emit(type, message);
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
