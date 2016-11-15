import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {user as userFields} from '../../constants/user'
import {Events} from '../../constants/userPreferences'
import {
  userChangePreferences,
  userSetPreferences,
  userPreferencesSetValue
} from '../../actions/userPreferences'
class UserPreferences extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {fields, changePreferences} = this.props;
    return (
        <div className="UserPreferences-area_wrapper">
          <div className="name_wrapper">
            <div className="name">
              <p>Настройки пользователя</p>
            </div>
          </div>
          <div className="UserPreferences_wrapper">
            {this.UserSettingsArea("Имя", "firstName", values[0], this.userOnchangeInput)}
            {this.UserSettingsArea("Фамилия", "lastName", values[1], this.userOnchangeInput)}
            {this.UserSettingsArea("Отчество", "middleName", values[2], this.userOnchangeInput)}
            {this.UserSettingsArea("Страна", "country", values[3], this.userOnchangeInput)}
            {this.UserSettingsArea("Населенный пункт", "place", values[4], this.userOnchangeInput)}
            {this.UserSettingsArea("Университет", "university", values[5], this.userOnchangeInput)}
            {this.UserSettingsArea("Школа", "school", values[6], this.userOnchangeInput)}
            {this.UserSettingsArea("Место работы", "workplace", values[7], this.userOnchangeInput)}
            <div className="submitButton">
              <input type="button" name="Submit" value="Принять" onClick={changePreferences.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  UserSettingsArea = (title, setname, basevalue, fn)=> {
    //console.log(basevalue);
    return ( <div className="module_wrapper">
      <div className="name_block">
        <p>{title}</p>
        <p>{basevalue}</p>
      </div>
      <div className="input_block">
        <input ref={setname} type="text" name={setname} value={basevalue} onChange={fn}/>
      </div>
    </div>)


  }
}

const mapDispatchProps = (dispatch) => {
  return {
    changePreferences: (event) => {
      dispatch(userChangePreferences({
        firstName: this.refs.firstName.value,
        lastName: this.refs.lastName.value,
        middleName: this.refs.middleName.value,
        country: this.refs.country.value,
        place: this.refs.place.value,
        university: this.refs.university.value,
        school: this.refs.school.value,
        workplace: this.refs.workplace.value
      }));
    }
  };
};

const mapStateProps = (state, ownProps) => {
  return {
    fields: state.user
      .get(userFields.status.id)
      .toJS()
  };
};

export default connect(mapStateProps, mapDispatchProps)(UserPreferences);
