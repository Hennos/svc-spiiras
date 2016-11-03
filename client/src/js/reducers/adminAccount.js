import {Events} from '../constants/adminAccount'
import {changeuserfromadmin, result} from '../constants/adminAccount'

import {state as initialState} from '../states/adminAccount'
import Immutable from 'immutable';

const adminAccountReducer = (state = initialState, action) => {

  switch (action.type) {

    case Events.adminAccountSetPreferences:
      var string;
      switch (action.string){
        case   1:
          string = 'Пользователь успешно добавлен.';
          break;
        case   2:
          string = 'Заполните все необходимые поля.';
          break;
        case   3:
          string = 'Невозможно добавить пользователя.';
          break;
        case   4:
          string = 'Ошибка подключения к пользовательскому аккаунту. Пользователь добавлен.';
          break;


      }
      console.log(string);
      return state.set(result, string);
       default:
      return state;
  }
};

export default adminAccountReducer;
