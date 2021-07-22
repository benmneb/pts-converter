import { createStore, compose } from 'redux';

import { reducer } from './reducer';

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  : compose;

export const store = createStore(reducer, enhancer);
