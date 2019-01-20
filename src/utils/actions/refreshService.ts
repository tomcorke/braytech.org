import { action } from 'typesafe-actions'
import { RefreshServiceState } from '../reducers/refreshService'

export const setRefreshServiceOptions = (options: Partial<RefreshServiceState>) => action('SET_REFRESH_SERVICE_OPTIONS', options);

export type RefreshServiceActions = ReturnType<
  typeof setRefreshServiceOptions
>