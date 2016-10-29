import React from 'react'
import {connect} from 'react-redux'
import {
  sendingUserRequest,
  sendingAddingRequest, sendingRemovingRequest,
  sendingRemovingFriend
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
    const {requestManToFriends} = this.props;
    const {agreeManRequest, disagreeManRequest} = this.props;
    const {removeFromFriends} = this.props;
    const buttons = {
      requestMan: {
        name: "requestMan",
        image: "fa fa-plus-circle",
        eventHandler: requestManToFriends,
        username
      },
      agreeRequest: {
        name: "agreeRequest",
        image: "fa fa-plus-circle",
        eventHandler: agreeManRequest,
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
          buttons.removeFriend,
          buttons.watchMan
        ];
      case 'request':
        return [
          buttons.agreeRequest,
          buttons.disagreeRequest,
          buttons.watchMan
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
    requestManToFriends: (username) => {
      dispatch(sendingUserRequest(username));
    },
    disagreeManRequest: (username) => {
      dispatch(sendingRemovingRequest(username));
    },
    agreeManRequest: (username) => {
      dispatch(sendingAddingRequest(username));
    },
    removeFromFriends: (username) => {
      dispatch(sendingRemovingFriend(username));
    }
  }
};

export default connect(null, mapDispatchManProps)(ButtonMap);
