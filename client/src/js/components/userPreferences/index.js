import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import {Events} from '../../constants/user'
import {user as userFields} from '../../constants/user'

import {
  sendChangingPreferences,
  getNewUserPreferences,
  setNewUserPreferences
} from '../../actions/user'

import UserSettingArea from './UserSettingArea'

const setAreaMap = [
  {
    title: "Имя",
    name: userFields.preferences.fields.firstName
  }, {
    title: "Фамилия",
    name: userFields.preferences.fields.lastName
  }, {
    title: "Отчество",
    name: userFields.preferences.fields.middleName
  }, {
    title: "Страна",
    name: userFields.preferences.fields.country
  }, {
    title: "Населенный пункт",
    name: userFields.preferences.fields.place
  }, {
    title: "Университет",
    name: userFields.preferences.fields.university
  }, {
    title: "Школа",
    name: userFields.preferences.fields.school
  }, {
    title: "Место работы",
    name: userFields.preferences.fields.workplace
  }
];

class UserPreferences extends React.Component {
  constructor(props) {
    super(props);

    this.state = {settings: {}, test: "test"};
  }

  render() {
    const {fields} = this.props;
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
              <UserSettingArea
                key={area.name} {...area} baseValue={fields[area.name]}
                onChange={this.onInputPreference}
              />
            )}
            <div className="submitButton">
              <input
                type="button" name="Submit" value="Принять"
                onClick={this.onSubmitPreference}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onInputPreference = (event) => {
    const inputName  = event.target.name,
          inputValue = event.target.value;
    this.setState((prevState) => {
      let postSettings = Object.assign({}, prevState.settings);
      if (inputValue) {
        postSettings[inputName] = inputValue;
      } else {
        delete postSettings[inputName];
      }
      return {settings: postSettings};
    });
  };

  onSubmitPreference = () =>
    this.props.changePreferences(Object.assign({}, this.state.settings));

}


const mapDispatchProps = (dispatch) => {
  return {
    changePreferences: (changes) => {
      dispatch(sendChangingPreferences(changes));
    }
  };
};

const mapStateProps = (state, ownProps) => {
  return {
    fields: state.user
      .get(userFields.preferences.id)
      .toJS()
  };
};

export default connect(mapStateProps, mapDispatchProps)(UserPreferences);
