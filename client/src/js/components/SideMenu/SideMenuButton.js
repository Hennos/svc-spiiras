import React from 'react'

class SideMenuButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onClick, buttonState, image, name} = this.props;
    return (
      <div className={"button " + buttonState} onClick={onClick}>
        <p className={image} />
      </div>
    );
  }
}

export default SideMenuButton;
