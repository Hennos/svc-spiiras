import React from 'react';
import {connect} from 'react-redux';

class SideMenuButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onClick, buttonState, image} = this.props;
    return (
      <div className={"button " + buttonState} onClick={onClick}>
        <p className={image}></p>
      </div>
    )
  }
}

export default SideMenuButton;
