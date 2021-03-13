import _ from 'lodash'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { OptionTypeBase } from 'react-select'

import { isImage } from '../common/util'
import { useApi } from '../hooks/useApi'
import { CreatableSelect } from './CreatableSelect'

const StoredItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  margin: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border2};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg2};
`

const ImageContainer = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  cursor: pointer;
`

const Image = styled.img`
  display: block;
  height: auto;
  object-fit: contain;
  object-position: center;
  max-width: 100%;
  max-height: 100%;
`

const ColntrolsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Controls = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  background: ${({ theme }) => theme.colors.bg3};
`

const ControlItem = styled.div`
  margin-left: 5px;
`

const Tags = styled.div`
  width: 100%;
  text-align: center;
`

const ControlIcon = styled.span`
  font-size: 20px;
  padding: 10px;
  user-select: none;
  cursor: pointer;
`

interface StoredItemProps {
  item: MetaItem
  allTags: string[]
  onDetail(data: { blobUrl: string; metaItem: MetaItem }): void
}

const tagsToOptions = (tags: string[]) =>
  _.map(tags, (t) => ({ label: t, value: t }))

export const StoredItem: FC<StoredItemProps> = ({
  item,
  allTags,
  onDetail,
}) => {
  const [blobUrl, setBlobUrl] = useState<string>(null)
  const [tags, setTags] = useState<string[]>([...item.tags])

  const { get, loading, response } = useApi({
    path: `/api/repository/items/${item.itemId}`,
  })

  const { post: postMeta } = useApi({
    method: 'POST',
    path: `/api/repository/items/${item.itemId}/meta`,
  })

  const onItemClick = useCallback(() => {
    onDetail({ blobUrl, metaItem: item })
  }, [blobUrl, item, onDetail])

  const handleTagsChange = useCallback((newVal: OptionTypeBase) => {
    setTags(_.map(newVal, 'value'))
  }, [])

  useEffect(() => {
    const run = async () => {
      await get()
      const b = await response.blob()
      setBlobUrl(URL.createObjectURL(b))
    }
    run()
  }, [get, response])

  const tagOptions = useMemo(
    () => _.map(allTags, (t) => ({ label: t, value: t })),
    [allTags]
  )

  return (
    <StoredItemContainer>
      {loading && 'loding'}
      <Controls>
        <ControlItem>{item.name}</ControlItem>
        <ControlItem>
          <ControlIcon>✖</ControlIcon>
        </ControlItem>
      </Controls>
      <ImageContainer onClick={onItemClick}>
        {isImage(item) && blobUrl && <Image src={blobUrl} />}
      </ImageContainer>
      <ColntrolsContainer>
        <Controls>
          <Tags>
            <CreatableSelect
              placeholder="Select tags..."
              value={tagsToOptions(tags)}
              closeMenuOnSelect={false}
              options={tagOptions}
              onChange={handleTagsChange}
            />
          </Tags>
        </Controls>
      </ColntrolsContainer>
    </StoredItemContainer>
  )
}
