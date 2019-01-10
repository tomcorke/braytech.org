import * as ls from '../../localStorage';

const refreshConfig = ls.get('setting.refresh') ? ls.get('setting.refresh') : false;
const defaultState = {
  config: {
    enabled: true,
    frequency: 30
  },
  active: false
}

export default function profileReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_REFRESH_OPTIONS':
      ls.set('setting.refresh', {
        enabled: action.payload.enabled,
        frequency: action.payload.frequency
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