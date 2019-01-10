import * as ls from '../../localStorage';

const refreshConfig = ls.get('setting.refresh') ? ls.get('setting.refresh') : {
  enabled: false,
  frequency: 20
};
const defaultState = {
  config: refreshConfig,
  active: false
}

export default function profileReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_REFRESH_OPTIONS':
      ls.set('setting.refresh', {
        ...state,
        ...action.payload
      });
      return {
        ...state,
        ...action.payload
      }
    case 'SET_REFRESH_STATE':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}