import React from 'react'

class CallFriendButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {inChat, onClick} = this.props;
    return (
      <div className="button_wrapper">
        <div className="button" onClick={onClick}>
          <p className={"fa fa-phone" + (inChat ? " in_chat" : " out_chat")}></p>
        </div>
      </div>
    );
  }
}

export default CallFriendButton;
