import React from 'react'

class CallFriendButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {inChat, onClick, isGotStream} = this.props;
    return (
      <div className="button_wrapper">
        <div className="button" onClick={(isGotStream && !inChat) ? onClick : this.onDisabled}>
          <p className={"fa fa-phone" + (inChat ? " in_chat" : " out_chat")} />
        </div>
      </div>
    );
  }

  onDisabled = () => {
    console.log("Добавление в разговор недоступно")
  }
}

export default CallFriendButton;
