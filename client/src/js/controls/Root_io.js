import {Events as EventsUser} from '../constants/user'
import {Events as EventsPeople} from '../constants/people'
import {Events as EventsUserPreferences} from '../constants/userPreferences'
import {Events as EventsAdminAccount} from '../constants/adminAccount'
import io from 'socket.io-client'
import _ from 'lodash'
import {setUserProperties} from  '../actions/user'
import {addedUserFriend} from  '../actions/user'
import {removedUserFriend} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'
import {userSetPreferences} from '../actions/userPreferences'
class Root {
  constructor(address, store) {
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
    this.connection.on(EventsUserPreferences.userSetPreferences, this.userSetPreferences);
  };


  changeEmitterMiddleware = ({getStore, dispatch}) => next => action => {
    if (!action) {
      return next(action)
    }
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
        case EventsUserPreferences.userChangePreferenses:
          console.log(action.type);
          console.log(action.object);
          this.emitUserPreferences(action.type, action.object);
          break;
        case EventsAdminAccount.adminAccountChangePreferenses:
          console.log(action.type);
          console.log(action.object);
          this.emitAccountChangePreferenses(action.type, action.object);
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
    this.store.dispatch(userSetPreferences(JSON.parse(user)));

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
  userSetPreferences= (data) => {
    console.log('onClient')
    console.log(data)
    if(data)
      console.log('indata')
      this.getUserData();
        };

  emitChangeInputValueEvent = (type, value) => {
    this.connection.emit(
      type,
      JSON.stringify(value)
    );
  };
  emitUserPreferences = (type, value) => {
    this.connection.emit(
      type,
      JSON.stringify(value)
    );
  };
  emitAccountChangePreferenses = (type, value) => {
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
