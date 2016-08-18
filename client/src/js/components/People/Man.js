import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash'
import {manType} from '../../constants/man'
import {user as userFields} from '../../constants/user'
import {sendingAddingFriend, sendingRemovingFriend} from '../../actions/user'

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
      return Man.createPushButton("fa fa-minus-circle", this.removeFromFriends);
    } else if (type == "other") {
      return Man.createPushButton("fa fa-plus-circle", this.addToFriends);
    }
  };

  addToFriends = () => {
    this.props.dispatch(sendingAddingFriend(this.props.username));
  };

  removeFromFriends = () => {
    this.props.dispatch(sendingRemovingFriend(this.props.username));
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

const mapDispatchPeoplesProps = (dispatch) => {
  return {
    dispatch
  };
};

export default connect(mapDispatchPeoplesProps)(Man);
