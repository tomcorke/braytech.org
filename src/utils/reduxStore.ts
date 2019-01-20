import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import thunk, { ThunkDispatch } from 'redux-thunk'
import { History } from 'history'

import appSettings, { AppSettingsState } from './reducers/appSettings';
import appStatus, { AppStatusState } from './reducers/appStatus';
import collectibles, { CollectiblesState } from './reducers/collectibles';
import manifest, { ManifestState } from './reducers/manifest';
import profile, { ProfileState } from './reducers/profile';
import refreshService, { RefreshServiceState } from './reducers/refreshService';
import roster, { RosterState } from './reducers/roster'
import theme, { ThemeState } from './reducers/theme';

const createRootReducer = (history: History) => combineReducers({
  appSettings,
  appStatus,
  collectibles,
  manifest,
  profile,
  refreshService,
  roster,
  router: connectRouter(history),
  theme,
})

const composeEnhancers = ((window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as <R>(a: R) => R) || compose

export interface ApplicationState {
  appSettings: AppSettingsState
  appStatus: AppStatusState
  collectibles: CollectiblesState
  manifest: ManifestState
  profile: ProfileState
  refreshService: RefreshServiceState
  roster: RosterState
  router: RouterState
  theme: ThemeState
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