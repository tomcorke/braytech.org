import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk'

import profile from './reducers/profile';
import theme from './reducers/theme';
import collectibles from './reducers/collectibles';
import refreshService from './reducers/refreshService';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  profile,
  theme,
  collectibles,
  refreshService
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const configureStore = (history, initialState = {}) => {
  return createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  )
}