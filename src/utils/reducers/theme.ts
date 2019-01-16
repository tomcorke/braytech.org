import * as ls from '../localStorage';

export interface ThemeState {
  selected: string
}

interface ThemeAction {
  type: 'SET_THEME'
  payload: string
}

let lsState = ls.get('setting.theme') ? ls.get('setting.theme') : undefined;
const defaultState: ThemeState = (lsState && lsState.selected) ? lsState : { selected: 'light-mode' };

export default function themeReducer(state: ThemeState = defaultState, action: ThemeAction): ThemeState {
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