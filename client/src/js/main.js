import React from 'react';
import { createStore, applyMiddleware  } from 'redux';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';

import {polyfillRequestAnimationFrame} from './utils/RedrawingCycleController'

import Reducers from './reducers/index';
import Root_io from './controls/Root_io';

import App from './components/App/index'


polyfillRequestAnimationFrame();

let root_io = new Root_io();
let store = createStore(Reducers,
  applyMiddleware(
    thunk,
    root_io.changeEmitterMiddleware,
    root_io.getterMiddleware
  ));
root_io.setConnection("localhost:3003", store);

ReactDom.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
