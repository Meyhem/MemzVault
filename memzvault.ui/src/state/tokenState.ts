import { selector } from 'recoil'
import { persistedAtom } from '../hooks/usePersistedState'

export const tokenState = persistedAtom({ key: 'tokenState', default: '' })

export const hasValidToken = selector({
  key: 'hasValidToken',
  get: ({ get }) => !!get(tokenState),
})
