import React from 'react'
import {chat} from '../../../constants/chat';

import Friend from './Friend/index'

class FriendArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {friends, sides, title} = this.props;
    const isGotStream = !!this.props.stream;
    return (
      <div className="module_wrapper">
        <div className="info_block">
          <p>{title}</p>
        </div>

        {friends.map(friend => (
          <Friend
            key={friend.username}
            isActiveSide={(sides[friend.username]) ? true : false}
            isGotStream={isGotStream}
            {...friend}
          />
        ))}
      </div>
    );
  }
}

export default FriendArea;
