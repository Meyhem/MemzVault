import _ from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { MemzResponse, useApi } from '../hooks/useApi'

interface MetaItem {
  ItemId: string
  OriginalFileName: string
  MimeType: string
  Name: string
  Tags: string[]
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Item = styled.div`
  display: flex;
  height: 300px;
  width: 300px;
  margin: 10px;
  background: ${({ theme }) => theme.colors.bg2};
`

const testData = _.times(20, (n) => ({ ItemId: n }))

const pageSize = 20

function useInfinityLoader(): [any, MetaItem[]] {
  const [drained, setDrained] = useState(false)
  const [currentBatch, setCurrentBatch] = useState(0)
  const [itemsMeta, setItemsMeta] = useState<MetaItem[]>(testData as any)
  const [isOnBottom, setIsOnBottom] = useState(false)
  const bottomProbe = useRef<HTMLElement>(null)

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

    setItemsMeta((items) => [...items, ...data.data.items])
    setCurrentBatch((b) => b + 1)
    setIsOnBottom(false)
    _.defer(triggerUpdate)
  }, [data, triggerUpdate])

  return [bottomProbe, itemsMeta]
}

export const RepositoryPage = () => {
  const [ref, itemsMeta] = useInfinityLoader()

  useEffect(() => {
    // setInterval(() => {
    //   get()
    // }, 5000)
  }, [])

  return (
    <div>
      <Container>
        {_.map(itemsMeta, (item, i) => (
          <Item key={i}>{i}</Item>
        ))}
      </Container>
      <div ref={ref} style={{ border: '1px solid white' }} />
    </div>
  )
}
