import React from 'react'

class PushButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {image, username, eventHandler} = this.props;
    return (
      <li className="button_wrapper">
        <div className="button">{
          (!eventHandler) ?
            <p className={image}/>
            :
            <p className={image} onClick={() => eventHandler(username)}/>
        }
        </div>
      </li>
    );
  }
}

export default PushButton;
