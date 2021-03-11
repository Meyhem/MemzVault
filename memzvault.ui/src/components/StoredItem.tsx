import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useApi } from '../hooks/useApi'

const StoredItemContainer = styled.div`
  display: flex;
  height: 300px;
  width: 300px;
  margin: 10px;
  background: ${({ theme }) => theme.colors.bg2};
`

interface StoredItemProps {
  item: MetaItem
}

function isImage(item: MetaItem) {
  return _.startsWith(item.mimeType, 'image')
}

export const StoredItem: FC<StoredItemProps> = ({ item }) => {
  const [blobUrl, setBlobUrl] = useState<string>(null)
  const { get, loading, response } = useApi(
    { path: `/api/repository/${item.itemId}` },
    []
  )

  useEffect(() => {
    const run = async () => {
      await get()
      const b = await response.blob()
      setBlobUrl(URL.createObjectURL(b))
    }
    run()
  }, [])

  return (
    <StoredItemContainer>
      {loading && 'loding'}
      {isImage(item) && blobUrl && <img src={blobUrl} />}
    </StoredItemContainer>
  )
}
