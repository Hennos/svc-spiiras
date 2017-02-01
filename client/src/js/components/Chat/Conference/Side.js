import React from 'react';
import {connect} from 'react-redux';
import {Chat} from '../../../constants/chat'

class Side extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {username, url} = this.props;
    return (
      <div className="side_wrapper">

        <div className="signal_wrapper">
          <video
            id={"" + username.toLowerCase() + "-signal"}
            autoPlay="autoplay">
          </video>
        </div>

        <div className="username_wrapper">
          <div className="username">
            <p>{username}</p>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateSideProps = (state, ownProps) => {
  return {
    url: state.chat
      .get(Chat.url)
  };
};

export default connect(mapStateSideProps)(Side);
