import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import {Events} from '../../constants/user'
import {user as userFields} from '../../constants/user'

import {
  userChangePreferences,
  userSetPreferences,
  userPreferencesSetValue
} from '../../actions/user'

import UserSettingArea from './UserSettingArea'

const setAreaMap = [
  {
    title: "Имя",
    name: userFields.status.fields.firstName
  }, {
    title: "Фамилия",
    name: userFields.status.fields.lastName
  }, {
    title: "Отчество",
    name: userFields.status.fields.middleName
  }, {
    title: "Страна",
    name: userFields.status.fields.country
  }, {
    title: "Населенный пункт",
    name: userFields.status.fields.place
  }, {
    title: "Университет",
    name: userFields.status.fields.university
  }, {
    title: "Школа",
    name: userFields.status.fields.school
  }, {
    title: "Место работы",
    name: userFields.status.fields.workplace
  }
];

class UserPreferences extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {fields, changePreferences} = this.props;
    return (
      <div className="userPreferences-component_wrapper">
        <div className="userPreferences-area_wrapper">
          <div className="name_wrapper">
            <div className="name">
              <p>Настройки пользователя</p>
            </div>
          </div>
          <div className="userPreferences_wrapper">
            {setAreaMap.map(area =>
              <UserSettingArea key={area.name} {...area} baseValue={fields[area.name]}/>
            )}
            <div className="submitButton">
              <input type="button" name="Submit" value="Принять" onClick={changePreferences.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
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
