import {Events as EventsUser, user as storeUserProperties, updatedUserFriend} from '../constants/user'
import {Events as EventsPeople, people as storePeopleProperties} from '../constants/people'
import io from 'socket.io-client'
import _ from 'lodash'
import {setUserProperties} from  '../actions/user'
import {newSearchedPeople} from '../actions/people'

// const for switch store states
const searchPeopleInputValue = 'SearchPeopleInputValue';
const currentUsername = 'CurrentUsername';
const currentFriends = 'CurrentFriends';
const updatedFriend = 'UpdatedFriend';

class Root {
  constructor(address, store) {
    this.store = store;

    this.connection = io(address, {reconnection: false});
    this.connection.on(EventsUser.connected, this.afterConnection);
    this.connection.on(EventsUser.disconnected, this.afterDisconnection);
    this.connection.on(EventsUser.newUserData, this.newUserData);
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

  newSearchPeople = (people) => {
    this.store.dispatch(newSearchedPeople(JSON.parse(people)));
  };

  getUserData() {
    console.log('emitted');
    this.connection.emit(EventsUser.getUserData)
  }

  emitChangeInputValueEvent(data) {
    this.connection.emit(
      EventsPeople.changePatternSearchPeople,
      JSON.stringify(data)
    );
  }

  emitFriendsEvent(userName, friendName, type) {
    this.connection.emit(
      type,
      JSON.stringify({
        username: userName,
        friend: friendName
      })
    );
  }

  storeHandlerChanges(state) {
    this.oldInputSearchPeopleValue = this.newInputSearchPeopleValue;
    this.newInputSearchPeopleValue = this.selectStoreState(state, searchPeopleInputValue);
    this.oldUserFriends = this.newUserFriends;
    this.newUserFriends = this.selectStoreState(state, currentFriends);
    this.currentUsername = this.selectStoreState(state, currentUsername);

    let data = {
      username: this.currentUsername,
      friends: this.newUserFriends,
      input: this.newInputSearchPeopleValue
    };

    if (this.oldInputSearchPeopleValue !== this.newInputSearchPeopleValue) {
      this.emitChangeInputValueEvent(data);
    }
    else {
      let friendName = this.selectStoreState(state, updatedFriend);
      if (this.oldUserFriends.length < this.newUserFriends.length) {
        this.emitFriendsEvent(this.currentUsername, friendName, EventsUser.addFriendToUser);
        this.emitChangeInputValueEvent(data);
      }
      else if (this.oldUserFriends.length > this.newUserFriends.length) {
        this.emitFriendsEvent(this.currentUsername, friendName, EventsUser.removeFriendFromUser);
        this.emitChangeInputValueEvent(data);
      }
    }
  }

  selectStoreState(state, name) {
    switch (name) {
      case currentUsername:
        return state.user
          .get(storeUserProperties.username);
      case currentFriends:
        return state.user
          .get(storeUserProperties.friends)
          .toArray()
          .map((friend) => friend.username);
      case updatedFriend:
        return state.user
          .get(updatedUserFriend);
      case searchPeopleInputValue:
        return state.people
          .get(storePeopleProperties.valueInputSearchPeople);
    }
  }
}

export default Root;
