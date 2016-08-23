import React from 'react'

class PushButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {className, eventHandler} = this.props;
    return (
      <li className="button_wrapper">
        <div className="button">{
          (!eventHandler) ?
            <p className={className}></p>
            :
            <p className={className} onClick={eventHandler}></p>
        }
        </div>
      </li>
    );
  }
}

export default PushButton;
