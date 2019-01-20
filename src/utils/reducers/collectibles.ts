import { AnyAction } from '../reduxStore'
import * as ls from '../localStorage';

export interface CollectiblesState {
  hideTriumphRecords: boolean
  hideChecklistItems: boolean
}

const defaultState = ls.get('setting.collectibleDisplayState') ? ls.get('setting.collectibleDisplayState') : {
  hideTriumphRecords: false,
  hideChecklistItems: false
};

export default function collectiblesReducer(state: CollectiblesState = defaultState, action: AnyAction): CollectiblesState {
  switch (action.type) {
    case 'SET_COLLECTIBLES':
      ls.set('setting.collectibleDisplayState', action.payload);
      return action.payload
    default:
      return state
  }
}