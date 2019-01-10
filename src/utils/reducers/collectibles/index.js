import * as ls from '../../localStorage';

const defaultState = ls.get('setting.collectibleDisplayState') ? ls.get('setting.collectibleDisplayState') : {
  hideTriumphRecords: false,
  hideChecklistItems: false
};

export default function collectiblesReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_COLLECTIBLES':
      ls.set('setting.collectibleDisplayState', action.payload);
      return action.payload
    default:
      return state
  }
}