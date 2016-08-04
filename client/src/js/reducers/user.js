import Immutable from 'immutable';
import {Events, user} from '../constants/user'


const userReducer = (state = Immutable.Map([
  [user.username, null],
  [user.place, ''],
  [user.firstName, ''],
  [user.lastName, ''],
  [user.image, undefined],
  [user.friends, [/*{
    username: "antoni-fox", firstName:"Anton" , lastName:"Saveliev", place:"Kazan", image: 'http://placehold.it/120x120&text=image1'
  }*/]]
]), action) => {

  switch (action.type) {
    case Events.newUserData:
      return state.merge(Immutable.Map(action.user));


    default:
      return state;
  }
};

export default userReducer;
