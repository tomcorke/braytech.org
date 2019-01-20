import { action } from 'typesafe-actions'

export const setAppStatus = (code: string, status: string | undefined = undefined) => {
  return action('SET_APP_STATUS', { code, status });
}

export type AppStatusActions = ReturnType<
  typeof setAppStatus
>