import React from 'react';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../../constants/visibility'
import {appComponentsTogglesKey} from '../../constants/visibility'
import {user as userFields} from '../../constants/user'
import {people as peopleAction} from '../../constants/people'
import {gettingSearchPeopleInput} from  '../../actions/people'

import PeopleArea from './PeopleArea'

class People extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible, friends, inputValueChange, people} = this.props;
    return (
      <div className={(visible ? "" : "display_none ") + "friends-component_wrapper"}>
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
      dispatch(gettingSearchPeopleInput(event.target.value));
    }
  };
};

const mapStatePeoplesProps = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.peopleArea),
    friends: state.user
      .get(userFields.friends)
      .toArray(),
    people: state.people
      .get(peopleAction.newSearchedPeople)
      .toArray()
  };
};

export default connect(mapStatePeoplesProps, mapDispatchPeoplesProps)(People);
