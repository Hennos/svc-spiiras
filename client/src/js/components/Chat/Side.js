import React from 'react';

class Side extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const username = this.props.username;
    return (
      <div className="side_wrapper">

        <div className="signal_wrapper">
          <video id={"" + username.toLowerCase() + "-signal"}></video>
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

export default Side;
