import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../../constants/visibility'
import {appComponentsTogglesKey} from '../../constants/visibility'
import {changeuserfromadmin as userFields} from '../../constants/adminAccount'
import {result} from '../../constants/adminAccount'

import {Events} from '../../constants/adminAccount'
import {adminAccountChangePreferenses, adminAccountSetPreferences} from '../../actions/adminAccount'
class adminAccount extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this);


    const {visible, title, user, result,  adminAccountChangePreferenses} = this.props;
    console.log(result);
    return (
      <div className={(visible ? "" : "display_none ") + "adminAccount-component_wrapper"}>
        <div className="adminAccount-area_wrapper">
          <div className="name_wrapper">
            <div className="name">
              <p>Административные настройки пользователя</p>
            </div>
          </div>
          <div className="adminAccount_wrapper">
            <div className="result_block">
              <p className={(result ? "" : "display_none ") + "result"}>{result}</p>
            </div>
            {this.adminInput("Логин","Username" )}
            {this.adminInput ("Пароль" , "Password")}
            {this.adminInput("Email","Email" )}
            <p>Запрет: </p>
            {this.adminCheckbox ("Совершать вызовы" , "makeCalls", "setMakeCall")}
            {this.adminCheckbox ("Добавлять друзей" , "addingFriends")}
            {this.adminCheckbox ("Принудительный вызов" , "forcedCall", "setForsedCall")}
            {this.adminCheckbox ("Интерактивная доска" , "interactiveBoard")}
            {this.adminCheckbox ("Запрашивать пароль при попытке выхода из профиля" , "passwordExitProfile")}
            {this.adminCheckbox ("Запрашивать пароль при манипуляции аудио/видео потоком" , "passwordManipulationOfAudioVideo")}
            <div className="submitButton">
              <input type="button" name="Submit" value="Создать аккаунт" onClick = {this.adminAccountChangePreferenses}  />
            </div>
          </div>
        </div>
      </div>
    );
  }
  adminInput=(title, setname)=> {
    return( <div className="input_wrapper">
      <div className="name_block">
        <p>{title}</p>
      </div>
      <div className="input_block">
        <input ref={setname} type="text" name={setname} />
      </div>
    </div>)
  }
  adminCheckbox=(title, setname, onchange)=> {
    return( <div className="checkbox_wrapper">
      <div className="name_block">
        <p>{title}</p>
      </div>
      <div className="checkbox_block">
        {
          (onchange == "setMakeCall" ) ?
            <input ref={setname} type="checkbox" name={setname} onClick = {this.setMakeCall}/>

            :
            (onchange == "setForsedCall" ) ?
              <input ref={setname} type="checkbox" name={setname} onClick = {this.setForsedCall}/>
              :
              <input ref={setname} type="checkbox" name={setname} />
        }

      </div>
    </div>)

  }

  adminAccountChangePreferenses = (event)=> {
    //console.log(this.refs.Login.value);
    console.log(this);
    this.props.dispatch(adminAccountChangePreferenses({username:this.refs.Username.value ,password:this.refs.Password.value , email:this.refs.Email.value ,makecalls:this.refs.makeCalls.checked ,addingfriends:this.refs.addingFriends.checked ,forcedcall:this.refs.forcedCall.checked ,interactiveboard:this.refs.interactiveBoard.checked ,passwordexitprofile:this.refs.passwordExitProfile.checked , passwordmanipulationofaudiovideo:this.refs.passwordManipulationOfAudioVideo.checked }));

  }
  setMakeCall = (event)=> {
    console.log('setMakeCall');
    this.refs.forcedCall.checked = false;

  }
  setForsedCall = (event)=> {
    this.refs.makeCalls.checked = true;
    console.log('setForsedCall');
  }
}

const mapDispatchAdminAccountProps = (dispatch) => {

  return {
    dispatch
  };
};

const mapStateAdminAccountProps = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.administrationAccount),
    result: state.adminAccount.get(result)

  };
};

export default connect(mapStateAdminAccountProps, mapDispatchAdminAccountProps)(adminAccount);
