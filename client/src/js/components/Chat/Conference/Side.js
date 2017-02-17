import React from 'react';
import {connect} from 'react-redux';
import {Chat} from '../../../constants/chat'

class Side extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(prevProps, prevState){
    if(this.props.video) {
      this.refs['signal_wrapper'].append(this.props.video);
      this.props.video.play();
    }
  }

  componentDidUpdate(prevProps, prevState){

    if(this.props.video) {
      if (prevProps.video !== this.props.video) this.refs['signal_wrapper'].append(this.props.video);
      this.props.video.play();
    }
  }



  render() {
    const {username, url} = this.props;
    return (
      <div className="side_wrapper">

        <div className="signal_wrapper" ref="signal_wrapper">

        </div>

        <div className="username_wrapper">
          <div className="username">
            <p>{username}</p>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateSideProps = (state, ownProps) => {
  let side = state.chat.get(Chat.sides).get(ownProps.username);
  return {
    url: state.chat
      .get(Chat.url),
    video: (side === undefined) ?
      undefined : side['video'],
    stream: (side === undefined) ?
      undefined : side['stream']

  };
};

export default connect(mapStateSideProps)(Side);
