import * as ls from '../../localStorage';

const defaultState = ls.get('setting.theme') ? ls.get('setting.theme') : { selected: 'light-mode' };

export default function themeReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_THEME':
      ls.set('setting.theme', {
        selected: action.payload
      });
      return {
        selected: action.payload
      }
    default:
      return state
  }
}