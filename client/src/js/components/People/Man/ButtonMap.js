import React from 'react'
import {connect} from 'react-redux'
import {
  sendingUserRequest, sendingRemovingRequest,
  sendingAddingFriend, sendingRemovingFriend
} from '../../../actions/user'

import PushButton from './PushButton'

class ButtonMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const curButtons = this.getCurButtons();
    return (
      <div className="buttons_wrapper">
        {curButtons.map(button =>
          <PushButton key={button.name} {...button}/>
        )}
      </div>
    )
  }

  getCurButtons() {
    const {username, type} = this.props;
    const {requestMan, disagreeManRequest} = this.props;
    const {addToFriends, removeFromFriends} = this.props;
    const buttons = {
      requestMan: {
        name: "requestMan",
        image: "fa fa-plus-circle",
        eventHandler: requestMan,
        username
      },
      agreeRequest: {
        name: "agreeRequest",
        image: "fa fa-plus-circle",
        eventHandler: addToFriends,
        username
      },
      disagreeRequest: {
        name: "disagreeRequest",
        image: "fa fa-minus-circle",
        eventHandler: disagreeManRequest,
        username
      },
      removeFriend: {
        name: "removeFriend",
        image: "fa fa-minus-circle",
        eventHandler: removeFromFriends,
        username
      },
      callFriend: {
        name: "callFriend",
        image: "fa fa-phone",
        username
      },
      watchMan: {
        name: "watchMan",
        image: "fa fa-search",
        username
      }
    };

    switch (type) {
      case 'friend':
        return [
          buttons.callFriend,
          buttons.removeFriend,
          buttons.watchMan
        ];
      case 'request':
        return [
          buttons.watchMan,
          buttons.agreeRequest,
          buttons.disagreeRequest
        ];
      case 'other':
        return [
          buttons.requestMan,
          buttons.watchMan
        ];
      default:
        return [];
    }
  }
}

const mapDispatchManProps = (dispatch) => {
  return {
    requestMan: (username) => {
      dispatch(sendingUserRequest(username));
    },
    disagreeManRequest: (username) => {
      dispatch(sendingRemovingRequest(username));
    },
    addToFriends: (username) => {
      dispatch(sendingAddingFriend(username));
    },
    removeFromFriends: (username) => {
      dispatch(sendingRemovingFriend(username));
    }
  }
};

export default connect(null, mapDispatchManProps)(ButtonMap);
