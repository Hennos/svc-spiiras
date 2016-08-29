import React from 'react';
import {connect} from 'react-redux';
import {chat} from '../../../constants/chat'
import {emitCloseConference} from '../../../actions/chat'

import Side from './Side'
import ConferenceCloseButton from './ConferenceCloseButton'

class Conference extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {sides, talking, onCloseConference} = this.props;
    return (
      <div className="conference-area_wrapper">
        <div className="conference-sides_wrapper">
          {sides.length > 0 ?
            sides.map(side => (
              <Side
                key={side.username}
                {...side}
              />
            ))
            :
            <div className="info_block">
              <p>Для начала конференции выберите друга из списка</p>
            </div>
          }
        </div>

        <div className={"conference-disconnect-block-wrapper" + (sides.length ? " display_block" : " display_none")}>
          <ConferenceCloseButton onClick={onCloseConference}/>
        </div>
      </div>
    );
  }
}

const mapDispatchConferenceProps = (dispatch) => {
  return {
    onCloseConference: () => {
      dispatch(emitCloseConference());
    }
  };
};

const mapStateConferenceProps = (state, ownProps) => {
  return {
    sides: state.chat
      .get(chat.sides)
      .toArray()
  };
};

export default connect(mapStateConferenceProps, mapDispatchConferenceProps)(Conference);
