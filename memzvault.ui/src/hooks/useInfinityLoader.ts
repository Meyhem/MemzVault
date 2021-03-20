import _ from 'lodash'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useApi, MemzResponse } from './useApi'

const pageSize = 20
export function useInfinityLoader() {
  const [drained, setDrained] = useState(false)
  const [currentBatch, setCurrentBatch] = useState(0)
  const [items, setItems] = useState<MetaItem[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [isOnBottom, setIsOnBottom] = useState(false)
  const bottomProbe = useRef<HTMLDivElement>(null)

  // check is is scrolled on bottom
  const checkProbeVisible = useCallback(() => {
    if (!bottomProbe.current) return
    const screenHeight = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    )
    const scroll = window.scrollY + screenHeight

    setIsOnBottom(scroll >= bottomProbe.current.offsetTop)
  }, [])

  // register scroll hnd
  useEffect(() => {
    document.addEventListener('scroll', checkProbeVisible)
    return () => document.removeEventListener('scroll', checkProbeVisible)
  }, [checkProbeVisible])

  const { data, get, cache } = useApi<MemzResponse<{ items: MetaItem[] }>>({
    path: '/api/repository/list',
    method: 'GET',
    authenticatedCall: true,
    params: {
      offset: currentBatch * pageSize,
      limit: pageSize,
      tags: tags,
    },
  })

  // when scrolled down and is not finished
  useEffect(() => {
    if (isOnBottom && !drained) {
      get()
    }
  }, [isOnBottom, drained, get])

  // when tags change start fetching from beginning
  useEffect(() => {
    setDrained(false)
    setCurrentBatch(0)
    setIsOnBottom(true)
    setItems([])
  }, [tags])

  // when data received add them to list
  useEffect(() => {
    if (!data) return

    if (!data.data.items.length) {
      setDrained(true)
    }

    setItems((items) => [...items, ...data.data.items])
    setCurrentBatch((b) => b + 1)
    setIsOnBottom(false)
    _.defer(checkProbeVisible)
  }, [data, checkProbeVisible])

  // do first fetch
  useEffect(() => {
    checkProbeVisible()
  }, [checkProbeVisible])

  return { bottomProbe, items, setItems, tags, setTags, cache }
}
