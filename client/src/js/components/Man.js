import React from 'react';
import {connect} from 'react-redux';
import {typeMan} from '../constants/man'
import {setUserProperties} from '../actions/user'

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

export default Man;
