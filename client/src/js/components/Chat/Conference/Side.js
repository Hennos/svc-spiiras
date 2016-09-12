import React from 'react';
import {connect} from 'react-redux';
import {chat} from '../../../constants/chat'

class Side extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {username, url} = this.props;
    console.log(url);
    return (
      <div className="side_wrapper">

        <div className="signal_wrapper">
          <video id={"" + username.toLowerCase() + "-signal"} src={url}></video>
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
      .get(chat.url)
  };
};

export default connect(mapStateSideProps)(Side);
