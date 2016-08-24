import React from 'react';

class Friend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {image, username} = this.props;
    return (
      <div className="friend_wrapper">
        <div className="friend">

          <div className="img_place">{
            (image != null) ?
              <img src={image} alt="Нет изображения"/>
              :
              <p className="fa fa-question-circle" aria-hidden="true"></p>
          }
          </div>

          <div className="username_wrapper">
            <div className="username">
              {username}
            </div>
          </div>

          <div className="button_wrapper">
            <div className="button">
              <p className="fa fa-phone"></p>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Friend;
