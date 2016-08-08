import React from 'react';
import {connect} from 'react-redux';
import {typeMan} from '../constants/man'
import {setUserProperties} from '../actions/user'

class Man extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {image, username, firstName, lastName, place, type} = this.props;
    return (
      <div className="man_wrapper">
        <div className="man">

          <div className="img_place">{
            (image != null) ?
              <img src={image} alt="Нет изображения"/>
              :
              <p className="fa fa-question-circle" aria-hidden="true"></p>
          }
          </div>

          <ul className="name_place">
            <li className="name">
              <div className="username">{username + '\n'}</div>
              <div className="allName">{
                (lastName != null) ? lastName : ''} {(firstName != null) ? firstName : ''
              }
              </div>
            </li>
            <li className="place">{place}</li>
          </ul>

          <ul className="buttons_wrapper">
            {Man.createPushButton("fa fa-phone")}
            {this.createFriendTogglingButton(type)}
            {Man.createPushButton("fa fa-search")}
          </ul>

        </div>
      </div>
    );
  };

  createFriendTogglingButton = (type) => {
    if (type == "friend") {
      return Man.createPushButton("fa fa-minus-circle", this.props.removeFromFriends);
    } else {
      return Man.createPushButton("fa fa-plus-circle", this.props.addToFriends);
    }
  };

  static createPushButton = (className = "default-button", eventHandler = null) => {
    return (
      <li className="button_wrapper">
        <div className="button">{
          (!eventHandler) ?
            <p className={className}></p>
            :
            <p className={className} onClick={eventHandler}></p>
        }
        </div>
      </li>
    )
  };
}

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

export default connect(mapEventHandlerProps)(Man);
