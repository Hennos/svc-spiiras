import React from 'react';

class ButtonOnOff extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isWorking, onClick} = this.props;
    return (
      <div className="video-camera_toggle-button" onClick={onClick}>
        <p className="text">{isWorking ? "Off" : "On"}</p>
        <p className={"image fa fa-power-off" + (isWorking ? " off" : " on")}></p>
      </div>
    );
  }
}

export default ButtonOnOff;
