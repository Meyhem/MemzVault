import { selector } from 'recoil'
import decodeJwt from 'jwt-decode'

import { persistedAtom } from '../hooks/usePersistedState'

function parseTok(tok: string) {
  try {
    const parsed = decodeJwt(tok)
    return parsed
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('invalid jwt', e)
    return null
  }
}

export const tokenState = persistedAtom({ key: 'tokenState', default: '' })

export const getRepositoryName = selector({
  key: 'getRepositoryName',
  get: ({ get }) => {
    const stored = get(tokenState)
    if (!stored) return ''

    const tok = parseTok(stored) as any
    return tok && tok['memz.repositoryName']
  },
})

export const hasValidToken = selector({
  key: 'hasValidToken',
  get: ({ get }) => {
    const stored = get(tokenState)
    if (!stored) return ''

    return !!parseTok(stored)
  },
})
