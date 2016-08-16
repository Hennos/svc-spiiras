import {Events as EventsUser, user as userFields, userRequests} from '../constants/user'
import {Events as EventsPeople, people as peopleProperties} from '../constants/people'
import {Events as EventsUserPreferences, newuser as userPreferencesProperties} from '../constants/UserPreferences'
import io from 'socket.io-client'
import _ from 'lodash'
import {setUserProperties} from  '../actions/user'
import {addFriendToUserOnServer} from  '../actions/user'
import {removeFriendFromUserOnServer} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'

// const for switch store states
const searchPeopleInputValue = 'SearchPeopleInputValue';
const addingFriend = 'AddingFriend';
const removingFriend = 'RemovingFriend';

class Root {
  constructor(address, store) {
    this.store = store;

    this.connection = io(address, {reconnection: false});

    this.connection.on(EventsUser.connected, this.afterConnection);
    this.connection.on(EventsUser.disconnected, this.afterDisconnection);
    this.connection.on(EventsUser.newUserData, this.newUserData);
    this.connection.on(EventsUser.addFriendToUserOnServer, this.addedFriendOnServer);
    this.connection.on(EventsUser.removeFriendFromUserOnServer, this.removedFriendOnServer);
    this.connection.on(EventsPeople.changePeople, this.newSearchPeople);

    this.storeUnsubscriber = store.subscribe(() => {
      this.storeHandlerChanges(store.getState());
    })
  }

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

  addedFriendOnServer = (friend) => {
    this.store.dispatch(addFriendToUserOnServer(friend));
  };

  removedFriendOnServer = (friend) => {
    this.store.dispatch(removeFriendFromUserOnServer(friend));
  };

  newSearchPeople = (people) => {
    this.store.dispatch(newSearchedPeople(JSON.parse(people)));
  };

  getUserData() {
    this.connection.emit(EventsUser.getUserData)
  }

  emitChangeInputValueEvent(data) {
    this.connection.emit(
      EventsPeople.changePatternSearchPeople,
      JSON.stringify(data)
    );
  }

  emitFriendsEvent(type, friendName) {
    this.connection.emit(
      type,
      JSON.stringify(friendName)
    );
  }

  storeHandlerChanges(state) {
    this.oldInputSearchPeopleValue = this.newInputSearchPeopleValue;
    this.newInputSearchPeopleValue = this.selectStoreState(state, searchPeopleInputValue);

    const input = this.newInputSearchPeopleValue;
    if (this.oldInputSearchPeopleValue !== this.newInputSearchPeopleValue) {
      this.emitChangeInputValueEvent(input);
    }
    else {
      if (this.selectStoreState(state, addingFriend)) {
        const nameAddingFriend = this.selectStoreState(state, addingFriend);
        this.emitFriendsEvent(EventsUser.addFriendToUserOnClient, nameAddingFriend);
        this.emitChangeInputValueEvent(input);
      }
      else if (this.selectStoreState(state, removingFriend)) {
        const nameRemovingFriend = this.selectStoreState(state, removingFriend);
        this.emitFriendsEvent(EventsUser.removeFriendFromUserOnClient, nameRemovingFriend);
        this.emitChangeInputValueEvent(input);
      }
    }
  }

  selectStoreState(state, name) {
    switch (name) {
      case addingFriend:
        return state.user
          .get(userRequests.addingFriend);
      case removingFriend:
        return state.user
          .get(userRequests.removingFriend);
      case searchPeopleInputValue:
        return state.people
          .get(peopleProperties.valueInputSearchPeople);
    }
  }
}

export default Root;
