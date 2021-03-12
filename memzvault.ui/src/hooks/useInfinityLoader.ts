import _ from 'lodash'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useApi, MemzResponse } from './useApi'

const pageSize = 20
export function useInfinityLoader() {
  const [drained, setDrained] = useState(false)
  const [currentBatch, setCurrentBatch] = useState(0)
  const [items, setItems] = useState<MetaItem[]>([])
  const [isOnBottom, setIsOnBottom] = useState(false)
  const bottomProbe = useRef<HTMLDivElement>(null)

  const triggerUpdate = useCallback(() => {
    const screenHeight = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    )
    const scroll = window.scrollY + screenHeight

    setIsOnBottom(scroll >= bottomProbe.current.offsetTop)
  }, [])

  useEffect(() => {
    document.addEventListener('scroll', triggerUpdate)
    return () => document.removeEventListener('scroll', triggerUpdate)
  }, [triggerUpdate])

  const { data, get } = useApi<MemzResponse<{ items: MetaItem[] }>>({
    path: '/api/repository/list',
    authenticatedCall: true,
    manual: true,
    params: {
      offset: currentBatch * pageSize,
      limit: pageSize,
    },
  })

  useEffect(() => {
    if (isOnBottom && !drained) {
      get()
    }
  }, [isOnBottom, drained, get])

  useEffect(() => {
    if (!data) return

    if (!data.data.items.length) {
      setDrained(true)
    }

    setItems((items) => [...items, ...data.data.items])
    setCurrentBatch((b) => b + 1)
    setIsOnBottom(false)
    _.defer(triggerUpdate)
  }, [data, triggerUpdate])

  useEffect(() => {
    triggerUpdate()
  }, [triggerUpdate])

  return { bottomProbe, items, setItems }
}
