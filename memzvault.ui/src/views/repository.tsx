import _ from 'lodash'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import React, { useCallback, useMemo, useState } from 'react'

import { useInfinityLoader } from '../hooks/useInfinityLoader'
import { useGlobalHook } from '../hooks/useGlobalHook'
import {
  StoredItem,
  DialogUpload,
  FixedControls,
  DialogDetail,
  DialogSettings,
} from '../components'

import { dialogVisibility } from '../state/dialogState'
import { tokenState } from '../state/tokenState'
import { useHistory } from 'react-router'
import { usePersistedState } from '../hooks/usePersistedState'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const ItemsGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const BottomProbe = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.bg2};
`

function getUniqueTagsByFrequency(items: MetaItem[]) {
  const allTags = _.map(
    _.flatMap(items, (item) => item.tags || []),
    _.toLower
  )
  const uniqueTags = _.uniq(allTags)
  const occurences = _.reduce(
    uniqueTags,
    (acc, item) => ({
      ...acc,
      [item]: _.filter(allTags, (t) => t === item).length,
    }),
    {}
  )

  const sorted = _.map(
    _.sortBy(_.toPairs(occurences), (pair) => -pair[1]),
    (pair) => pair[0]
  )

  return sorted
}

export const RepositoryPage = () => {
  useGlobalHook()
  const { bottomProbe, items, setItems } = useInfinityLoader()
  const [, setDialog] = useRecoilState(dialogVisibility)
  const [, setToken] = usePersistedState(tokenState)
  const history = useHistory()

  const [detailData, setDetailData] = useState<{
    blobUrl: string
    metaItem: MetaItem
  }>(null)

  const tagList = useMemo(() => getUniqueTagsByFrequency(items), [items])

  const showAddDialog = useCallback(() => setDialog('Upload'), [setDialog])
  const showSettingsDialog = useCallback(() => setDialog('Settings'), [
    setDialog,
  ])
  const logout = useCallback(() => {
    history.push('/')
    setToken('')
  }, [history, setToken])
  const showDetailDialog = useCallback(
    (data: { blobUrl: string; metaItem: MetaItem }) => {
      setDetailData(data)
      setDialog('Detail')
    },
    [setDialog]
  )

  const onUploadFinished = useCallback(
    (newItems) => {
      setItems((i) => [...newItems, ...i])
      setDialog(null)
    },
    [setDialog, setItems]
  )

  const handleItemDelete = (item: MetaItem) => {
    setItems(_.reject(items, (it) => it.itemId === item.itemId))
  }
  const handleItemUpdate = (item: MetaItem) => {
    const idx = _.findIndex(items, (it) => it.itemId == item.itemId)
    const updatedItems = [...items.slice(0, idx), item, ...items.slice(idx + 1)]
    setItems(updatedItems)
  }

  return (
    <Container>
      <DialogUpload onUploadFinished={onUploadFinished} />
      <DialogDetail {...detailData} />
      <DialogSettings />
      <ItemsGrid>
        {_.map(items, (item) => (
          <StoredItem
            key={item.itemId}
            item={item}
            onDeleted={handleItemDelete}
            onUpdated={handleItemUpdate}
            onDetail={showDetailDialog}
            allTags={tagList}
          />
        ))}
      </ItemsGrid>
      <FixedControls
        onAdd={showAddDialog}
        onSettings={showSettingsDialog}
        onLogout={logout}
      />
      <BottomProbe ref={bottomProbe} />
    </Container>
  )
}
