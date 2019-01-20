import objectEntries from 'lodash/entries';
import { HttpClient, HttpClientConfig } from 'bungie-api-ts/http';

import Globals from './globals';

interface FetcherConfig {
  noHeaders?: boolean
}

type FetcherHttpClientConfig = HttpClientConfig & FetcherConfig

const fetcher = async (config: FetcherHttpClientConfig) => {
  const url = (config.method === 'GET' && config.params && Object.keys(config.params).length > 0)
    ? `${config.url}?${objectEntries(config.params).map(([key, value]) => `${key}=${value}`).join('&')}`
    : config.url;
  const get = await fetch(url, {
    method: config.method,
    headers: config.noHeaders ? {} : {
      'X-API-Key': Globals.key.bungie || ''
    }
  })
  return get.json()
}

export default fetcher