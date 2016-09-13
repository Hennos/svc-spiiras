import React from 'react'
import {connect} from 'react-redux'
import {emitAddSideToChat} from '../../../../actions/chat'

import CallFriendButton from './CallFriendButton'

class Friend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {isActiveSide, isGotStream, image, username, onAddToSide} = this.props;
    return (
      <div className="friend_wrapper">
        <div className="friend">

          <div className="img_place">{
            (image) ?
              <img src={image} alt="Нет изображения"/>
              :
              <p className="fa fa-question-circle"></p>
          }
          </div>

          <div className="username_wrapper">
            <div className="username">
              {username}
            </div>
          </div>

          <CallFriendButton
            inChat={isActiveSide}
            isGotStream = {isGotStream}
            onClick={() => {onAddToSide(username)}}
          />

        </div>
      </div>
    )
  }
}

const mapDispatchFriendEvent = (dispatch) => {
  return {
    onAddToSide: (side) => {
      console.log('Добавить в разговор ', side.username);
      dispatch(emitAddSideToChat(side));
    }
  };
};

export default connect(null, mapDispatchFriendEvent)(Friend);
