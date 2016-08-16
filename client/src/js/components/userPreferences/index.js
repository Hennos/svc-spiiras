import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../../constants/visibility'
import {appComponentsTogglesKey} from '../../constants/visibility'
import {user as userFields} from '../../constants/user'

import {Events} from '../../constants/userPreferences'
import {userChangePreferenses} from '../../actions/userPreferences'
class UserPreferences extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {visible, title,  user, userChangePreferenses} = this.props;
    return (
      <div className={(visible ? "" : "display_none ") + "userPreferences-component_wrapper"}>
        <div className="UserPreferences-area_wrapper">
      <div className="name_wrapper">
        <div className="name">
            <p>Настройки пользователя</p>
          </div>
      </div>
        <div className="UserPreferences_wrapper">
          {this.UserSettingsArea("Имя","Name" )}

          {this.UserSettingsArea ("Фамилия" , "Surname")}
          {this.UserSettingsArea ("Отчество" , "MiddleName")}
          {this.UserSettingsArea ("Страна" , "Country")}
          {this.UserSettingsArea ("Населенный пункт" , "Locality")}
          {this.UserSettingsArea ("Университет" , "University")}
          {this.UserSettingsArea ("Школа" , "School")}
          {this.UserSettingsArea ("Место работы" , "PlaceOfWork")}
          <div className="submitButton">
          <input type="button" name="Submit" value="Принять" onClick = {this.userChangePreferenses} />
        </div>
  </div>
    </div>
    </div>
  );
  }
  UserSettingsArea=(title, setname)=> {
    return( <div className="module_wrapper">
        <div className="name_block">
          <p>{title}</p>
        </div>
        <div className="input_block">
          <input ref={setname} type="text" name={setname} />
        </div>
      </div>)
   }
  userChangePreferenses = (event)=> {

    console.log(Name.value);

    console.log(this);
    this.props.dispatch(userChangePreferenses({firstName:this.refs.value , Surname:this.refs.Surname.value ,middleName:this.refs.MiddleName.value ,country:this.refs.Country.value ,locality:this.refs.Locality.value ,university:this.refs.University.value ,school:this.refs.School.value , placeOfWork:this.refs.PlaceOfWork.value }));

}
}

const mapDispatchUserPreferencesProps = (dispatch) => {
  return {
    dispatch
  };
};

const mapStateUserPreferencesProps = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.userPreferences)

  };
};

export default connect(mapStateUserPreferencesProps, mapDispatchUserPreferencesProps)(UserPreferences);
