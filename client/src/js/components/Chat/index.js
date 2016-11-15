import React from 'react';

import Conference from './Conference/index'
import Searching from './FriendList/index'

class Chat extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <div className="chat-component_wrapper">
        <div className="chat-component-block_wrapper">
          <Conference/>
          <Searching/>
        </div>
      </div>
    );
  }
}

export default Chat;
