import React from 'react';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'
import {user} from '../constants/user'
import {people} from '../constants/people'
import {setInputSearchPeopleValue} from  '../actions/people'

import Man from './Man'

class PeopleArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {people, title, type} = this.props;
    return (
      <div className="module_wrapper">
        <div className="info_block">
          <p>{title}</p>
        </div>
        {people.map(man =>
          <Man
            key={man.username}
            type={type}
            {...man}
          />)}
      </div>
    );
  }
}

class People extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible, friends, inputValueChange, people} = this.props;
    return (
      <div className={(visible ? "" : "display_none") + " friends-component_wrapper"}>
        <div className="button-close-component_wrapper">
          <p className="button fa fa-times-circle"></p>
        </div>

        <div className="search-area_wrapper">
          <div className="name_wrapper">
            <div className="name">
              <p>Поиск</p>
            </div>
          </div>
          <div className="search_wrapper">
            <input type="text" name="search-area" onChange={inputValueChange}/>
          </div>
        </div>

        <div className="people-area_wrapper">
          <div className="people_wrapper">
            {friends.length > 0 ?
              <PeopleArea people={friends} title="Друзья" type="friend"/>
              :
              <PeopleArea people={friends} title="У вас пока нет ни одного друга"/>
            }
            {people.length > 0 ?
              <PeopleArea people={people} title="Найденные пользователи" type="other"/>
              :
              <PeopleArea people={people} title="Нет найденных пользователей"/>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchPeoplesProps = (dispatch) => {
  return {
    inputValueChange: (event)=> {
      dispatch(setInputSearchPeopleValue(event.target.value));
    }
  };
};

const mapStatePeoplesProps = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.peopleArea),
    friends: state.user.get(user.friends),
    people: state.people.get(people.newSearchedPeople)
  };
};

export default connect(mapStatePeoplesProps, mapDispatchPeoplesProps)(People);
