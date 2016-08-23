import React from 'react'
import {connect} from 'react-redux'
import {sendingAddingFriend, sendingRemovingFriend} from '../../../actions/user'

import PushButton from './PushButton'

class FriendTogglingButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {type, username, addToFriends, removeFromFriends} = this.props;
    if (type == "friend") {
      return (
        <PushButton
          className="fa fa-minus-circle"
          eventHandler={() => {removeFromFriends(username)}}
        />
      );
    } else if (type == "other") {
      return (
        <PushButton
          className="fa fa-plus-circle"
          eventHandler={() => {addToFriends(username)}}
        />
      )
    }
  }
}

const mapDispatchManProps = (dispatch) => {
  return {
    addToFriends: (username) => {
      dispatch(sendingAddingFriend(username));
    },
    removeFromFriends: (username) => {
      dispatch(sendingRemovingFriend(username));
    }
  }
};

export default connect(null, mapDispatchManProps)(FriendTogglingButton);
