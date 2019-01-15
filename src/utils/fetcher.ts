import objectEntries from 'lodash/entries';
import { HttpClient, HttpClientConfig } from 'bungie-api-ts/http';

import Globals from './globals';

const fetcher: HttpClient = async (config: HttpClientConfig) => {
  const url = (config.method === 'GET' && config.params && Object.keys(config.params).length > 0)
    ? `${config.url}?${objectEntries(config.params).map(([key, value]) => `${key}=${value}`).join('&')}`
    : config.url;
  const get = await fetch(url, {
    method: config.method,
    headers: {
      'X-API-Key': Globals.key.bungie || ''
    }
  })
  return get.json()
}

export default fetcher