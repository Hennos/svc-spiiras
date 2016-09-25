import React from 'react'
import {connect} from 'react-redux'
import {sendingAddingFriend, sendingRemovingFriend} from '../../../actions/user'

import PushButton from './PushButton'

class ButtonMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const curButtons = this.getCurButtons();
    return (
      <div>
        {curButtons.map(button =>
          <PushButton key={button.name} {...button}/>
        )}
      </div>
    )
  }

  getCurButtons() {
    const {username, type} = this.props;
    const {addToFriends, removeFromFriends} = this.props;
    const buttons = {
      callFriend: {
        name: "callFriend",
        image: "fa fa-phone",
        username
      },
      addFriend: {
        name: "addFriend",
        image: "fa fa-plus-circle",
        eventHandler: addToFriends,
        username
      },
      removeFriend: {
        name: "removeFriend",
        image: "fa fa-minus-circle",
        eventHandler: removeFromFriends,
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
          buttons.watchMan
        ];
      case 'other':
        return [
          buttons.addFriend,
          buttons.watchMan
        ];
      default:
        return [];
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

export default connect(null, mapDispatchManProps)(ButtonMap);
