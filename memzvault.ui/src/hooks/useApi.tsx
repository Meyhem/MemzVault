import { CachePolicies, useFetch, UseFetch } from 'use-http'
import { stringify } from 'querystring'
import { useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import _ from 'lodash'
import { useHistory } from 'react-router'

import { history } from '../common/history'
import { config } from '../common/config'
import { hasValidToken, tokenState } from '../state/tokenState'

export interface MemzResponse<T> {
  data: T
  error: {
    errorMessage: string
    genericDescription: string
    errorCode: string
    stack: string
  }
}

interface CallConfig {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'
  params?: any
  body?: any
  authenticatedCall?: boolean
}

export function useApi<T>(cfg: CallConfig, deps?: Array<any>): UseFetch<T> {
  const url = new URL(cfg.path, config.apiUrl)
  url.search = stringify(cfg.params)

  const h = useHistory()
  const validToken = useRecoilValue(hasValidToken)
  const token = useRecoilValue(tokenState)

  useEffect(() => {
    if (cfg.authenticatedCall && !validToken) {
      // eslint-disable-next-line no-console
      console.warn('Authenticated call failed because token is not valid')
      history.push('/')
    }
  }, [cfg.authenticatedCall, validToken])

  const additionalHeaders = _.pickBy(
    {
      Authorization: validToken ? `Bearer ${token}` : null,
    },
    _.identity
  )

  return useFetch<T>(
    url.href,
    {
      method: cfg.method,
      cache: 'no-cache',
      cachePolicy: CachePolicies.NO_CACHE,
      headers: { ...additionalHeaders },
      interceptors: {
        response: ({ response }) => {
          if (response.status === 401) {
            h.push('/')
          }
          return Promise.resolve(response)
        },
      },
    },
    deps
  )
}
