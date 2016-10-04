import React from 'react'
import {connect} from 'react-redux'
import {user as userFields} from '../../../constants/user'
import {chat} from '../../../constants/chat'
import {Stream} from '../../../constants/videoCamera'

import FriendArea from './FriendArea'

class FriendList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {friends, sides, stream} = this.props;
    return (
      <div className="friend-list-area_wrapper">
        <div className="search-area_wrapper">
          <div className="name_wrapper">
            <p>Поиск</p>
          </div>
          <div className="search_wrapper">
            <input type="text" name="search-area"/>
          </div>
        </div>

        {friends.length > 0 ?
          <FriendArea friends={friends} sides={sides} stream={stream} title="Друзья"/>
          :
          <FriendArea friends={friends} title="У вас нет друзей"/>
        }
      </div>
    );
  }
}

const mapStateFriendListProps = (state, ownProps) => {
  return {
    friends: state.user
      .get(userFields.friends)
      .toArray(),
    sides: state.chat
      .get(chat.sides)
      .toJS(),
    stream: state.videoCameraComponent
      .get(Stream.localStream)
  };
};

export default connect(mapStateFriendListProps)(FriendList);
