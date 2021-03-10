import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
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

function useInfinityLoader(): [any, MetaItem[]] {
  const [currentBatch, setCurrentBatch] = useState(0)
  const [itemsMeta, setItemsMeta] = useState<MetaItem[]>(testData as any)
  const [isOnBottom, setIsOnBottom] = useState(false)
  const bottomProbe = useRef<HTMLElement>(null)

  const { data, get, loading, error } = useApi<
    MemzResponse<{ items: MetaItem[] }>
  >({
    path: '/api/repository/list',
    authenticatedCall: true,
    manual: true,
  })

  useEffect(() => {
    if (isOnBottom) {
      get()
      console.log('trigered', isOnBottom)
    }
  }, [isOnBottom, get])

  useEffect(() => {
    const scrollHandler = () => {
      const screenHeight = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      )
      const scroll = window.scrollY + screenHeight

      setIsOnBottom(scroll >= bottomProbe.current.offsetTop)
      console.log('scroll fired', scroll >= bottomProbe.current.offsetTop)
    }

    document.addEventListener('scroll', scrollHandler)
    return () => document.removeEventListener('scroll', scrollHandler)
  }, [])

  useEffect(() => {
    if (!data) return

    // eslint-disable-next-line no-console
    console.log('finished loading data', data)
    setItemsMeta((items) => [...items, ...data.data.items])
  }, [data])

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
