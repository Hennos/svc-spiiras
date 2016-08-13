import React from 'react';
import {connect} from 'react-redux';
import {componentsVisibilityToggles} from '../../constants/visibility'
import {appComponentsTogglesKey} from '../../constants/visibility'

import Conference from './Conference'
import Searching from './Searching'

class Chat extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    const visible = this.props.visible;
    return (
      <div className={(visible ? "" : "display_none ") + "chat-component_wrapper"}>
        <Conference/>
        <Searching/>
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
