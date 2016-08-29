import {Events as EventsUser} from '../constants/user'
import {Events as EventsPeople} from '../constants/people'
import {Events as EventsChat} from '../constants/chat'
import io from 'socket.io-client'
import _ from 'lodash'
import {setUserProperties, addedUserFriend, removedUserFriend} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'
import {addSideToChat, closeConference} from '../actions/chat'

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
    this.connection.on(EventsUser.addFriendToUser, this.updateUserAfterAddingFriend);
    this.connection.on(EventsUser.removeFriendFromUser, this.updateUserAfterRemovingFriend);
    this.connection.on(EventsPeople.changeSearchedPeople, this.updateSearchedPeople);
    this.connection.on(EventsChat.addSide, this.pushSideToConference);
  };

  changeEmitterMiddleware = ({getStore, dispatch}) => next => action => {
    switch (action.type) {
      case EventsPeople.emitSearchPeopleInputChange:
        this.emitChangeInputValueEvent(action.type, action.value);
        break;
      case EventsUser.emitAddingFriend:
        this.emitFriendsEvent(action.type, action.friend);
        break;
      case EventsUser.emitRemovingFriend:
        this.emitFriendsEvent(action.type, action.friend);
        break;
      case EventsChat.emitAddedSide:
        debugger;
        this.emitAddedSide(action.type, action.side);
        break;
      case EventsChat.emitCloseConference:
        this.emitCloseConferenceEvent(action.type);
        break;
    }
    return next(action);
  };

  afterConnection = () => {
    console.log('connected');
    this.getUserData();
  };

  afterDisconnection = () => {
    console.log('disconnect')
  };

  newUserData = (user) => {
    this.store.dispatch(setUserProperties(JSON.parse(user)));
  };

  getUserData = () => {
    this.connection.emit(EventsUser.getUserData);
  };

  updateUserAfterAddingFriend = (friend) => {
    this.store.dispatch(addedUserFriend(friend));
    this.emitChangeInputValueEvent(EventsPeople.emitSearchPeopleInputChange, this.searchPeopleInput);
  };

  updateUserAfterRemovingFriend = (friend) => {
    this.store.dispatch(removedUserFriend(friend));
    this.emitChangeInputValueEvent(EventsPeople.emitSearchPeopleInputChange, this.searchPeopleInput);
  };

  updateSearchedPeople = (people) => {
    this.store.dispatch(newSearchedPeople(JSON.parse(people)));
  };

  pushSideToConference = (side) => {
    this.store.dispatch(addSideToChat(side));
  };

  emitChangeInputValueEvent = (type, value) => {
    this.connection.emit(type, JSON.stringify(value));
    this.searchPeopleInput = value;
  };

  emitFriendsEvent = (type, friendName) => {
    this.connection.emit(type, JSON.stringify(friendName));
  };

  emitAddedSide = (type, sideName) => {
    this.connection.emit(type, sideName);
  };

  emitCloseConferenceEvent = (type) => {
    this.store.dispatch(closeConference());
    this.connection.emit(type);
  }
}

export default Root;
