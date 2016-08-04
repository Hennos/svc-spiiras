import {Events, user as storeUserProperties} from '../constants/user';
import io from 'socket.io-client';
import {setUserProperties} from  '../actions/user';

// const for switch store states
const searchPeopleInputValue = 'SearchPeopleInputValue';


class Root {


  constructor(address, store) {



    this.store = store;

    this.connection = io(address, {reconnection: false});
    this.connection.on(Events.connected, this.afterConnection.bind(this));
    this.connection.on(Events.disconnected, this.afterDisconnection);
    this.connection.on(Events.newUserData, this.newUserData.bind(this));

    this.storeUnsubscriber = store.subscribe(() => {
      this.storeHandlerChanges(store.getState());
    })

  }

  afterConnection() {
    console.log('connected');
    this.getUserData();
  }

  afterDisconnection() {
    console.log('disconnect')
  }

  getUserData() {
    console.log('emited');
    this.connection.emit(Events.getUserData)
  }

  newUserData(user) {
    this.store.dispatch(setUserProperties(JSON.parse(user)));
    //console.log(user);
  }

  storeHandlerChanges(state) {
    this.oldInputSearchPeopleValue = this.newInputSearchPeopleValue;
    this.newInputSearchPeopleValue = this.selectStoreState(state, searchPeopleInputValue);


    if (this.oldInputSearchPeopleValue !== this.newInputSearchPeopleValue)
      this.connection.emit(Events.changeValueInputSearchPeople, this.newInputSearchPeopleValue);

  }

  selectStoreState(state, name) {

    switch (name) {
      case searchPeopleInputValue:
        return state.user.get(storeUserProperties.valueInputSearchPeople);
    }
  }


}

export default Root;
