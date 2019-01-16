import { AppStatusActions } from '../actions/appStatus'

export interface AppStatusState {
  code?: string
  status?: string
}

const initialState = {}

export default (state: AppStatusState = initialState, action: AppStatusActions) => {
  switch (action.type) {

    case 'SET_APP_STATUS':
      return action.payload;

    default:
      return state;
  }
}