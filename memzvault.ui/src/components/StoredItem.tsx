import _ from 'lodash'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { OptionTypeBase } from 'react-select'
import { useTranslation } from 'react-i18next'

import { isImage } from '../common/util'
import { MemzResponse, useApi } from '../hooks/useApi'
import { CreatableSelect } from './CreatableSelect'
import { useNotifications } from '../hooks/useNotifications'

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
  word-break: break-all;
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
  onDeleted(item: MetaItem): void
  onUpdated(item: MetaItem): void
}

const tagsToOptions = (tags: string[]) =>
  _.map(tags, (t) => ({ label: t, value: t }))

export const StoredItem: FC<StoredItemProps> = ({
  item,
  allTags,
  onDetail,
  onDeleted,
  onUpdated,
}) => {
  const [blobUrl, setBlobUrl] = useState<string>(null)
  const [tags, setTags] = useState<string[]>([...item.tags])
  const { notifyHttp } = useNotifications()
  const { t } = useTranslation()

  const { get, loading, response } = useApi({
    path: `/api/repository/items/${item.itemId}`,
  })

  const {
    delete: deleteItem,
    request: deleteRequest,
    response: deleteResponse,
  } = useApi<MemzResponse<any>>({
    method: 'DELETE',
    path: `/api/repository/items/${item.itemId}`,
  })

  const { put: putMeta, request: metaRequest, response: metaResponse } = useApi<
    MemzResponse<any>
  >({
    method: 'PUT',
    path: `/api/repository/items/${item.itemId}/meta`,
  })

  const handleDelete = useCallback(async () => {
    if (!confirm(t('strings:ConfirmDelete'))) return

    await deleteItem()
    if (deleteResponse.ok) onDeleted(item)

    notifyHttp(deleteRequest, deleteResponse, t('strings:ItemDeleted'))
  }, [
    t,
    deleteItem,
    deleteResponse,
    onDeleted,
    item,
    notifyHttp,
    deleteRequest,
  ])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPutMeta = useCallback(
    _.debounce(async (tags: string[]) => {
      await putMeta({ tags })
      onUpdated({ ...item, tags })
      notifyHttp(metaRequest, metaResponse, t('strings:TagsUpdated'))
    }, 1000),
    []
  )

  const handleItemClick = useCallback(() => {
    onDetail({ blobUrl, metaItem: item })
  }, [blobUrl, item, onDetail])

  const handleTagsChange = useCallback(
    async (newVal: OptionTypeBase) => {
      const arr = _.map(newVal, 'value')
      setTags(arr)
      debouncedPutMeta(arr)
    },
    [debouncedPutMeta]
  )

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
      {loading && t('strings:Loading')}
      <Controls>
        <ControlItem>{item.name}</ControlItem>
        <ControlItem>
          <ControlIcon onClick={handleDelete}>✖</ControlIcon>
        </ControlItem>
      </Controls>
      <ImageContainer onClick={handleItemClick}>
        {isImage(item) && blobUrl && <Image src={blobUrl} />}
      </ImageContainer>
      <ColntrolsContainer>
        <Controls>
          <Tags>
            <CreatableSelect
              placeholder={t('strings:SelectTags')}
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
