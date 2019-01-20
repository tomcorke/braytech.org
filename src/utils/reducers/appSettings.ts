import { getSettings, setSetting } from '../localStorage'
import { AppSettingsActions } from '../actions/appSettings'

export interface AppSettingsState {
  hideCompletedRecords: boolean
  language?: string
}

const savedSettings = getSettings()
const initialState: AppSettingsState = {
  hideCompletedRecords: false,
  ...savedSettings
}

export default (state: AppSettingsState = initialState, action: AppSettingsActions): AppSettingsState => {
  switch (action.type) {
    case 'SET_APP_SETTING':
      setSetting(action.payload.name, action.payload.value);
      return {
        ...state,
        [action.payload.name]: [action.payload.value]
      }
    default:
      return state
  }
}