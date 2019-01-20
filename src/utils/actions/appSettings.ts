import { action } from 'typesafe-actions'
import { AppSettingsState } from '../reducers/appSettings'
import { Dispatch, ApplicationState } from '../reduxStore';

export function setSetting<K extends keyof AppSettingsState, V extends AppSettingsState[K]>(name: K, value: V) {
  return action('SET_APP_SETTING', { name, value })
}

type BooleanApplicationSetting<K> = K extends keyof AppSettingsState
  ? (AppSettingsState[K] extends boolean ? K : never) : never

export function toggleSetting<K>(name: BooleanApplicationSetting<K>) {
  return (dispatch: Dispatch, getState: () => ApplicationState) => {
    const state = getState()
    const currentValue = !!state.appSettings[name]
    const newValue = !currentValue
    dispatch(setSetting(name, newValue))
  }
}

export type AppSettingsActions = ReturnType<
  typeof setSetting
>