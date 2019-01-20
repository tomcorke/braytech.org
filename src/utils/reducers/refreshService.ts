import * as ls from '../localStorage';

import { RefreshServiceActions } from '../actions/refreshService'

export interface RefreshServiceState {
  config: {
    enabled: boolean
    frequency: number
  }
  active: boolean
}

const defaultState: RefreshServiceState = ls.get('setting.refresh') ? ls.get('setting.refresh') : {
  config: {
    enabled: false,
    frequency: 20
  },
  active: false
};

export default function profileReducer(state: RefreshServiceState = defaultState, action: RefreshServiceActions): RefreshServiceState {
  switch (action.type) {
    case 'SET_REFRESH_SERVICE_OPTIONS':
      ls.set('setting.refresh', {
        ...state,
        ...action.payload
      });
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}