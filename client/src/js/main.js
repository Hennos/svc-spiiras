import React from 'react';
import { createStore, applyMiddleware  } from 'redux';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';

import SideMenu from './components/SideMenu';
import VideoCameraComponent from './components/VideoCamera';
import PeoplesComponent from './components/People';
import Reducers from './reducers/index';
import Root_io from './controls/Root_io';

/*let friends = io('http://localhost:3001/friends', {reconnection: false});
let root = io('http://localhost:3001', {reconnection: false});

root.on('connect', function () {
  friends.emit('say', 'hi!');
});
root.on('disconnect', function () {
  console.log('disconnect')
});*/

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SideMenu/>
        <div className="wrapper_components">
          <VideoCameraComponent/>
          <PeoplesComponent/>
        </div>
      </div>
    );
  }
}

let store = createStore(Reducers,
  applyMiddleware(thunk));

let root_io = new Root_io('http://localhost:3003', store);

ReactDom.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);

