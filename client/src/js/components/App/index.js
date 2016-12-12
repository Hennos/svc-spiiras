import React from 'react'

import Header from '../Header/index'
import SideMenu from '../SideMenu/index';
import ComponentWrapper from '../ComponentWrapper/index'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main_wrapper">
        <Header/>
        <div className="content_wrapper">
          <SideMenu/>
          <ComponentWrapper/>
        </div>
      </div>
    );
  }
}

export default App;
