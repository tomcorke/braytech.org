import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import thunk from 'redux-thunk'
import { History } from 'history'

import profile, { ProfileState } from './reducers/profile';
import theme, { ThemeState } from './reducers/theme';
import collectibles from './reducers/collectibles';
import refreshService from './reducers/refreshService';

const createRootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  profile,
  theme,
  collectibles,
  refreshService
})

const composeEnhancers = ((window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as <R>(a: R) => R) || compose

export interface ApplicationState {
  router: RouterState
  profile: ProfileState
  theme: ThemeState
}

export const configureStore = (history: History, initialState: ApplicationState) => {
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