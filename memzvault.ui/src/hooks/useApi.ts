import { useFetch, UseFetch } from 'use-http'
import { stringify } from 'querystring'

import { config } from '../common/config'

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
  manual?: boolean
}

export function useApi<T>(cfg: CallConfig, deps?: Array<any>): UseFetch<T> {
  const url = new URL(cfg.path, config.apiUrl)
  url.search = stringify(cfg.params)

  return useFetch<T>(url.href, { method: cfg.method }, deps)
}
