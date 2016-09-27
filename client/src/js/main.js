import React from 'react';
import { createStore, applyMiddleware  } from 'redux';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';

import SideMenu from './components/SideMenu/index';
import VideoCameraComponent from './components/VideoCamera/index';
import PeoplesComponent from './components/People/index';
import ChatComponent from './components/Chat/index'
import Reducers from './reducers/index';
import Root_io from './controls/Root_io';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="wrapper_components">
          <VideoCameraComponent/>
          <PeoplesComponent/>
          <ChatComponent/>
        </div>
        <SideMenu/>
      </div>
    );
  }
}

let root_io = new Root_io();
let store = createStore(Reducers,
  applyMiddleware(
    thunk,
    root_io.changeEmitterMiddleware,
    root_io.getterMiddleware
  ));
root_io.setConnection('192.168.0.82:3003', store);

ReactDom.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
