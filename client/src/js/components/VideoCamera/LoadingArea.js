import React from 'react';

class LoadingArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="video-camera_spinner-area">
        <p className="image fa fa-spinner fa-pulse"></p>
        <p className="text">Loading...</p>
      </div>
    );
  }
}

export default LoadingArea;
