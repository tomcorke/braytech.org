import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import thunk, { ThunkDispatch } from 'redux-thunk'
import { History } from 'history'

import appStatus, { AppStatusState } from './reducers/appStatus';
import profile, { ProfileState } from './reducers/profile';
import theme, { ThemeState } from './reducers/theme';
import collectibles, { CollectiblesState } from './reducers/collectibles';
import refreshService, { RefreshServiceState } from './reducers/refreshService';
import manifest, { ManifestState } from './reducers/manifest';

const createRootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
  appStatus,
  profile,
  theme,
  collectibles,
  refreshService,
  manifest
})

const composeEnhancers = ((window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as <R>(a: R) => R) || compose

export interface ApplicationState {
  appStatus: AppStatusState
  router: RouterState
  profile: ProfileState
  theme: ThemeState
  collectibles: CollectiblesState
  refreshService: RefreshServiceState
  manifest: ManifestState
}

export type AnyAction = { type: string, payload: any }
export type Dispatch = ThunkDispatch<ApplicationState, null, AnyAction>

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