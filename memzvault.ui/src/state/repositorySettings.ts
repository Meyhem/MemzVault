import { persistedAtom } from '../hooks/usePersistedState'

export interface Settings {
  [key: string]: RepositorySettings
}

export interface RepositorySettings {
  language: string
}

export const settingsState = persistedAtom<Settings>({
  key: 'settingsState',
  default: {},
})
