import React from 'react';

import ExitPasswordForm from './ExitPasswordForm/index'

class ExitButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {activeForm: false, closeFormTimer: false};
  }

  render() {
    const {activeForm} = this.state;
    return (
      <div className="exit-button-area">
        <a className="button" href="/logout" onClick={this.handleClick}>Выход</a>
        {activeForm && <ExitPasswordForm outFocus={this.handleFormOutFocus} onFocus={this.handleFormOnFocus}/>}
      </div>
    );
  }

  handleClick = (event) => {
    if (this.props.exitPassword) {
      this.setState({activeForm: true});
      event.preventDefault();
    }
  };

  handleFormOutFocus = () => {
    const closeForm = () => this.setState({activeForm: false});
    this.setState({closeFormTimer: setTimeout(closeForm, 7500)});
  };

  handleFormOnFocus = () => {
    if (this.state.closeFormTimer) {
      clearTimeout(this.state.closeFormTimer);
    }
  };
}

export default ExitButton;
