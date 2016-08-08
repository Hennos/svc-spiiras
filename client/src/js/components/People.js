import React from 'react';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../constants/visibility'
import {appComponentsTogglesKey} from '../constants/visibility'
import {user} from '../constants/user'
import {people} from '../constants/people'
import {setInputSearchPeopleValue} from  '../actions/people'
import {setUserProperties} from '../actions/user'

const typeMan = {
  friend: 'friend',
  other: 'other'
};

let Man = ({addToFriends, removeFromFriends, image, username, firstName, lastName, place, type}) => (
  <div className="man_wrapper">
    <div className="man">
      <div className="img_place">
        {(image != null) ?
          <img src={image} alt="Нет изображения"/>
          :
          <p className="fa fa-question-circle" aria-hidden="true"></p>
        }
      </div>
      <ul className="name_place">
        <li className="name">
          <div className="username">{username + '\n'}</div>
          <div className="allName">
            {(lastName != null) ? lastName : ''} {(firstName != null) ? firstName : ''}
          </div>
        </li>
        <li className="place">{place}</li>
      </ul>
      <ul className="buttons_wrapper">

        <li className="button_wrapper">
          <div className="button">
            <p className="fa fa-phone"></p>
          </div>
        </li>
        <li className="button_wrapper">
          <div className="button">
            <p className="fa fa-plus-circle" onClick={addToFriends}></p>
          </div>
        </li>
        <li className="button_wrapper">
          <div className="button">
            <p className="fa fa-minus-circle" onClick={removeFromFriends}></p>
          </div>
        </li>
        <li className="button_wrapper">
          <div className="button">
            <p className="fa fa-search"></p>
          </div>
        </li>
      </ul>

    </div>
  </div>
);

const mapEventHandlerProps = (dispatch) => {
  return {
    addToFriends: () => {
      console.log(this);
    },
    removeFromFriends: () => {
      console.log(this);
    }
  }
};

Man = connect(mapEventHandlerProps)(Man);

const PeoplesArea = ({people, title, type}) =>(
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

let People = ({visible, friends, inputValueChange, people}) => (
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
              <PeoplesArea people={friends} title="Друзья" type="friend"/>
              :
              <PeoplesArea people={friends} title="У вас пока нет ни одного друга"/>
            }

            {people.length > 0 ?
              <PeoplesArea people={people} title="Найденные пользователи" type="other"/>
              :
              <PeoplesArea people={people} title="Нет найденных пользователей"/>
            }

      </div>
    </div>
  </div>
);

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

People = connect(mapStatePeoplesProps, mapDispatchPeoplesProps)(People);

export default People;
