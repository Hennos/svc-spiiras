import {Events as EventsUser, user as storeUserProperties} from '../constants/user';
import {Events as EventsPeople, people as storePeopleProperties} from '../constants/people'
import io from 'socket.io-client';
import {setUserProperties} from  '../actions/user';
import {newSearchedPeople} from '../actions/people'
import _ from 'lodash'

// const for switch store states
const searchPeopleInputValue = 'SearchPeopleInputValue';
const currentUsername = 'CurrentUsername';
const currentFriends = 'CurrentFriends';

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
    console.log(EventsUser.getUserData);
    this.connection.emit(EventsUser.getUserData)
  }

  storeHandlerChanges(state) {
    this.oldInputSearchPeopleValue = this.newInputSearchPeopleValue;
    this.newInputSearchPeopleValue = this.selectStoreState(state, searchPeopleInputValue);
    this.currentUsername = this.selectStoreState(state, currentUsername);
    this.oldUserFriends = this.newUserFriends;
    this.newUserFriends = this.selectStoreState(state, currentFriends);

    if (this.oldInputSearchPeopleValue !== this.newInputSearchPeopleValue) {
      let data = {
        username: this.currentUsername,
        friends: this.newUserFriends,
        input: this.newInputSearchPeopleValue
      };
      data = JSON.stringify(data);

      this.connection.emit(EventsPeople.changeValueInputSearchPeople, data);
    } else if (!(_.isEqual(this.oldUserFriends, this.newUserFriends))) {
      let data = this.newUserFriends;
      data = JSON.stringify(data);

      this.connection.emit(EventsUser.updateUserFriends, data);
    }
  }

  selectStoreState(state, name) {
    switch (name) {
      case currentUsername:
        return state.user
          .get(storeUserProperties.username);
      case currentFriends:
        return state.user
          .get(storeUserProperties.friends);
      case searchPeopleInputValue:
        return state.people
          .get(storePeopleProperties.valueInputSearchPeople);
    }
  }

}

export default Root;
