import React from 'react'

import SideMenu from '../SideMenu/SideMenu';
import ToggleMenuButton from '../SideMenu/ToggleMenuButton';
import ComponentWrapper from '../ComponentWrapper/index'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main_wrapper">
        <ToggleMenuButton/>
        <div className="content_wrapper">
          <SideMenu/>
          <ComponentWrapper/>
        </div>
      </div>
    );
  }
}

export default App;
