import { ProfileState } from "./reducers/profile";
import { AppSettingsState } from "./reducers/appSettings";

var localStorage = window.localStorage;

function set<T>(key: string, value: T): void {
  const valueString = JSON.stringify(value);
  try {
    localStorage.setItem(key, valueString);
  } catch(e) {
    console.log(e);
  }
}

function get<T>(key: string): T | undefined {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : undefined;
  } catch(e) {
    console.log(e);
  }
}

function updateList<T>(key: string, value: T, unique: false, limit: number | undefined): void;
function updateList<T>(key: string, value: T, unique: true, limit: number | undefined, matchSelector: (item: T) => boolean): void;
function updateList<T>(key: string, value: T, unique: boolean, limit: number | undefined, matchSelector?: (item: T) => boolean): void {

  const existingValues = get<T[]>(key);

  if (!existingValues) {
    return set(key, [value]);
  }

  if (!unique) {
    return set(key, existingValues.concat([ value ]))
  }

  if (!matchSelector) throw Error('matchSelector required for unique lists')

  const existingValueIndex = existingValues.findIndex(matchSelector)
  let newValues: T[]
  if (existingValueIndex > -1) {
    newValues = existingValues.splice(existingValueIndex, 1, value)
  } else {
    newValues = [value].concat(existingValues)
  }
  if (limit) {
    newValues = newValues.slice(0, limit)
  }
  return set(key, newValues);
}

interface ProfileHistoryEntry {
  membershipType: number
  membershipId: string
  displayName: string
}

export function getProfileHistory(): ProfileHistoryEntry[] {
  const values = get<ProfileHistoryEntry[]>('history.profiles')
  return values || [];
}

export function updateProfileHistory(value: ProfileHistoryEntry) {
  updateList('history.profiles', value, true, 6, (entry => entry.membershipId === value.membershipId));
}

export function getDefaultProfile(): ProfileState | undefined {
  return get<ProfileState>('profile.default')
}

export function setDefaultProfile(profile: ProfileState) {
  set('profile.default', profile);
}

export function getSettings(): AppSettingsState | undefined {
  return get<AppSettingsState>('application.settings')
}

export function setSetting<K extends keyof AppSettingsState, V extends AppSettingsState[K]>(name: K, value: V) {
  const existingSettings = getSettings()
  const newSettings: Partial<AppSettingsState> = {
    ...existingSettings,
    [name]: value
  }
  set('application.settings', newSettings)
}