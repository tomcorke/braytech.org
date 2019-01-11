import * as ls from '../../localStorage';

const defaultState = ls.get('setting.refresh') ? ls.get('setting.refresh') : {
  config: {
    enabled: false,
    frequency: 20
  },
  active: false
};

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