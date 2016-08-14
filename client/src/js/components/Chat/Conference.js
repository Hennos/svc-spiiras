import React from 'react';
import {connect} from 'react-redux';
import {chat} from '../../constants/chat'

import Side from './Side'

class Conference extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sides = this.props.sides;
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

        <div className="conference-disconnect-button_wrapper">
          <div className="button">
            <p className="fa fa-square"></p>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateConferenceProps = (state, ownProps) => {
  return {
    sides: state.chat
      .get(chat.sides)
      .toArray()
  };
};

export default connect(mapStateConferenceProps)(Conference);
