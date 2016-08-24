import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {user as userFields} from '../../constants/user'
import {values as valFields} from '../../constants/userPreferences'
import {componentsVisibilityToggles} from '../../constants/visibility'
import {appComponentsTogglesKey} from '../../constants/visibility'
import {Events} from '../../constants/userPreferences'
import {userChangePreferenses, userSetPreferences, userPreferencesSetValue } from '../../actions/userPreferences'
class UserPreferences extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    const {visible, title,  user, values,   userChangePreferenses, userOnchangeInput} = this.props;
    return (

      <div className={(visible ? "" : "display_none ") + "userPreferences-component_wrapper"}>
        <div className="UserPreferences-area_wrapper">
      <div className="name_wrapper">
        <div className="name">
            <p>Настройки пользователя</p>
          </div>
      </div>
        <div className="UserPreferences_wrapper">
          {this.UserSettingsArea("Имя","Name",values.get(userFields.firstName), this.userOnchangeInput)}
          {this.UserSettingsArea ("Фамилия" , "Surname", values.get(userFields.lastname), this.userOnchangeInput)}
          {this.UserSettingsArea ("Отчество" , "MiddleName", values.get(userFields.middlename),this.userOnchangeInput)}
          {this.UserSettingsArea ("Страна" , "Country", values.get(userFields.country),this.userOnchangeInput)}
          {this.UserSettingsArea ("Населенный пункт" , "Locality", values.get(userFields.place),this.userOnchangeInput)}
          {this.UserSettingsArea ("Университет" , "University", values.get(userFields.universety),this.userOnchangeInput)}
          {this.UserSettingsArea ("Школа" , "School", values.get(userFields.school),this.userOnchangeInput)}
          {this.UserSettingsArea ("Место работы" , "PlaceOfWork", values.get(userFields.workplace),this.userOnchangeInput)}
          <div className="submitButton">
          <input type="button" name="Submit" value="Принять" onClick = {this.userChangePreferenses} />
        </div>
  </div>
    </div>
    </div>
  );
  }
  UserSettingsArea=(title, setname, basevalue, fn )=> {
    console.log(basevalue);
    return( <div className="module_wrapper">
        <div className="name_block">
          <p>{title}</p>
          <p>{basevalue}</p>
        </div>
        <div className="input_block">
          <input ref={setname} type="text" name={setname} value ={basevalue} onChange = {fn}  />
        </div>
      </div>)


  }
  userOnchangeInput = (event)=> {
    console.log(event);
    this.props.dispatch(userPreferencesSetValue({name: event.target.name, val:event.target.value}));
  }
  userChangePreferenses = (event)=> {
    console.log(this.refs.Name.value);
    console.log(this);
    this.props.dispatch(userChangePreferenses({firstName:this.refs.Name.value , Surname:this.refs.Surname.value ,middleName:this.refs.MiddleName.value ,country:this.refs.Country.value ,place:this.refs.Locality.value ,university:this.refs.University.value ,school:this.refs.School.value , workplace:this.refs.PlaceOfWork.value }));

}
}

const mapDispatchUserPreferencesProps = (dispatch) => {

  return {
    dispatch
  };
};

const mapStateUserPreferencesProps = (state, ownProps) => {
  console.log(state);
  return {

    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.userPreferences),
    user: state.user,
    values: state.values
  };
};

export default connect(mapStateUserPreferencesProps, mapDispatchUserPreferencesProps)(UserPreferences);
