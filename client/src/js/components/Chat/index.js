import React from 'react';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../../constants/visibility'
import {appComponentsTogglesKey} from '../../constants/visibility'

import Conference from './Conference'
import Searching from './FriendList'

class Chat extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    const visible = this.props.visible;
    return (
      <div className={"chat-component_wrapper" + (visible ? "" : " display_none")}>
        <div className="chat-component-block_wrapper">
          <Conference/>
          <Searching/>
        </div>
      </div>
    );
  }
}

const mapStateChatProps = (state, ownProps) => {
  return {
    visible: state.componentsVisibilityFilter
      .get(appComponentsTogglesKey)
      .get(componentsVisibilityToggles.chatArea)
  };
};

export default connect(mapStateChatProps)(Chat);
