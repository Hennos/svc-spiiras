import React from 'react';
import {connect} from 'react-redux';
import {user as userFields} from '../../constants/user'
import {people as peopleAction} from '../../constants/people'
import {gettingSearchPeopleInput} from  '../../actions/people'

import PeopleArea from './PeopleArea'

class People extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {friends, people, requests, inputValueChange} = this.props;
    return (
      <div className="friends-component_wrapper">
        <div className="search-area_wrapper">
          <div className="name_wrapper">
            <p>Поиск</p>
          </div>
          <div className="search_wrapper">
            <input type="text" name="search-area" onChange={inputValueChange}/>
          </div>
        </div>

        <div className="people-area_wrapper">
          <div className="people_wrapper">
            <PeopleArea people={friends} title="Друзья" alt="Нет найденных друзей" type="friend"/>
            <PeopleArea people={requests} title="Запросы" alt="Нет активных запросов" type="request"/>
            <PeopleArea people={people} title="Пользователи" alt="Нет найденных пользователей" type="other"/>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchPeoplesProps = (dispatch) => {
  return {
    inputValueChange: (event)=> {
      dispatch(gettingSearchPeopleInput(event.target.value));
    }
  };
};

const mapStatePeoplesProps = (state, ownProps) => {
  return {
    friends: state.user
      .get(userFields.friends)
      .toArray(),
    requests: state.user
      .get(userFields.requests)
      .toArray(),
    people: state.people
      .get(peopleAction.newSearchedPeople)
      .toArray()
  };
};

export default connect(mapStatePeoplesProps, mapDispatchPeoplesProps)(People);
