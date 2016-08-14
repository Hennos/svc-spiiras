import React from 'react'

import Friend from './Friend'

class FriendArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {friends, title} = this.props;
    return (
      <div className="module_wrapper">
        <div className="info_block">
          <p>{title}</p>
        </div>
        {friends.map(friend => (
          <Friend
            key={friend.username}
            {...friend}
          />
        ))}
      </div>
    );
  }
}

export default FriendArea;
