import { action } from 'typesafe-actions'
import { getDestinyManifest } from 'bungie-api-ts/destiny2/api'
import { ServerResponse } from 'bungie-api-ts/common';

import { Dispatch } from '../reduxStore'
import { DestinySettings, DestinyManifestJsonContent } from '../reducers/manifest';
import fetcher from '../fetcher'
import db from '../dexie';
import { setAppStatus } from './appStatus'

const setManifestState = (version: string, manifestContent: DestinyManifestJsonContent) => action('SET_MANIFEST_STATE', {
  version,
  manifestContent
});

const setSettingsState = (settings: DestinySettings) => action('SET_SETTINGS_STATE', settings);

const loadManifestData = async (dispatch: Dispatch): Promise<{ version: string, manifestContent: DestinyManifestJsonContent } | undefined> => {
  const manifestVersion = await db.versionString.get(1)
  if (!manifestVersion) {
    console.warn('Manifest version not found in IndexedDB')
    return undefined
  }

  const manifestContent = await db.manifestContent.get(manifestVersion.version)
  if (!manifestContent) {
    console.warn(`Manifest content not found in IndexedDB for version ${manifestVersion.version}`)
    return undefined
  }

  return { version: manifestVersion.version, manifestContent }
}

const fetchManifestContent = async (versionPath: string) => {
  const manifestContentPath = `https://www.bungie.net${versionPath}`
  const manifestContent: DestinyManifestJsonContent = await fetcher({
    url: manifestContentPath,
    method: 'GET',
    noHeaders: true
  })
  if (manifestContent) {
    return manifestContent;
  }
  throw Error('Manifest data unexpectedly failed to fetch');
}

const fetchDestinySettings = async (): Promise<ServerResponse<DestinySettings>> => {
  return fetcher({ url: 'https://www.bungie.net/Platform/Settings/', method: 'GET' })
}

export const getManifestContent = (language: string) => {
  return async (dispatch: Dispatch) => {

    dispatch(setAppStatus('loading'))

    const [
      existingManifestData,
      manifestServerResponse,
      destinySettingsResponse
    ] = await Promise.all([
      loadManifestData(dispatch),
      getDestinyManifest(fetcher),
      fetchDestinySettings()
    ])

    if (manifestServerResponse.ErrorCode !== 1) {
      dispatch(setAppStatus('error', 'Error fetching destiny manifest'));
      console.error('Error fetching Destiny manifest', manifestServerResponse)
      throw Error(manifestServerResponse.Message)
    }

    if (destinySettingsResponse.ErrorCode !== 1) {
      dispatch(setAppStatus('error', 'Error fetching Destiny settings'));
      console.error('Error fetching Destiny settings', destinySettingsResponse)
      throw Error(destinySettingsResponse.Message)
    }

    // Store settings in manifest state, since we fetch them every time anyway
    dispatch(setSettingsState(destinySettingsResponse.Response))

    const manifest = manifestServerResponse.Response

    if (manifest && existingManifestData && existingManifestData.version === manifest.version) {
      // If manifest data exists and version matches what we just pulled from Bungie
      // use manifest values loaded from DB and don't load new content
      dispatch(setManifestState(existingManifestData.version, existingManifestData.manifestContent));
      dispatch(setAppStatus('ready'));
      return;
    }

    // In all other cases, fetch new manifest data
    const versionPath = manifest.jsonWorldContentPaths[language];
    const manifestContent = await fetchManifestContent(versionPath);

    console.log('Saving manifest version and content to IndexedDB');
    await db.addAllData(manifest.version, manifestContent);

    dispatch(setManifestState(manifest.version, manifestContent))
    dispatch(setAppStatus('ready'));
  }
}

export type ManifestActions = ReturnType<
  | typeof setManifestState
  | typeof setSettingsState
>