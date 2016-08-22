import {Events as EventsUser} from '../constants/user'
import {Events as EventsPeople} from '../constants/people'
import io from 'socket.io-client'
import _ from 'lodash'
import {setUserProperties} from  '../actions/user'
import {addedUserFriend} from  '../actions/user'
import {removedUserFriend} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'

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
  };

  changeEmitterMiddleware = ({getStore, dispatch}) => next => action => {
    switch (action.type) {
      case EventsPeople.emitSearchPeopleInputChange:
        this.emitChangeInputValueEvent(action.type, action.value);
        this.searchPeopleInput = action.value;
        break;
      case EventsUser.emitAddingFriend:
        this.emitFriendsEvent(action.type, action.friend);
        break;
      case EventsUser.emitRemovingFriend:
        this.emitFriendsEvent(action.type, action.friend);
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

  emitChangeInputValueEvent = (type, value) => {
    this.connection.emit(
      type,
      JSON.stringify(value)
    );
  };

  emitFriendsEvent = (type, friendName) => {
    this.connection.emit(
      type,
      JSON.stringify(friendName)
    );
  };
}

export default Root;
