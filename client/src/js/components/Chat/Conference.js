import React from 'react';
import {connect} from 'react-redux';

class Conference extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="conference-area_wrapper">
        <div className="conference-sides_wrapper">

        </div>

        <div className="conference-disconnect-button_wrapper">
          <div className="button">
            <p className="fa fa-square"></p>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateConferenceProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateConferenceProps)(Conference);
