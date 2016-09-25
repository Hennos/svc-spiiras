import React from 'react';

class ConferenceCloseButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onClick} = this.props;
    return (
      <div className="conference-close-button_wrapper">
        <div className="button" onClick={onClick}>
          <p className="fa fa-square" />
        </div>
      </div>
    );
  }
}

export default ConferenceCloseButton;
