import React from 'react';
import { createStore, applyMiddleware  } from 'redux';
import { Provider } from 'react-redux';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';

import Reducers from './reducers/index';
import Root_io from './controls/Root_io';

import App from './components/App/index'

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


let polyfillAllBrowsers = function () {

  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
      || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = (callback, element) => {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = (id) => {
      clearTimeout(id);
    };
};
polyfillAllBrowsers();
