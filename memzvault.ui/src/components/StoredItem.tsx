import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useApi } from '../hooks/useApi'

const StoredItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  margin: 10px;
  background: ${({ theme }) => theme.colors.bg2};
`

const ImageContainer = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
`

const Image = styled.img`
  display: block;
  height: auto;
  object-fit: contain;
  object-position: center;
  max-width: 100%;
  max-height: 100%;
`

const Controls = styled.div`
  height: 30px;
  background: ${({ theme }) => theme.colors.bg3};
`

interface StoredItemProps {
  item: MetaItem
}

function isImage(item: MetaItem) {
  return _.startsWith(item.mimeType, 'image')
}

//react-zoom-pan-pinch

export const StoredItem: FC<StoredItemProps> = ({ item }) => {
  const [blobUrl, setBlobUrl] = useState<string>(null)
  const { get, loading, response } = useApi(
    { path: `/api/repository/items/${item.itemId}` },
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
      <ImageContainer>
        {isImage(item) && blobUrl && <Image src={blobUrl} />}
      </ImageContainer>
      <Controls>ctrl</Controls>
    </StoredItemContainer>
  )
}
