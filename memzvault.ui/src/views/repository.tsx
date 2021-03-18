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
  CreatableSelect,
} from '../components'

import { dialogVisibility } from '../state/dialogState'
import { tokenState } from '../state/tokenState'
import { useHistory } from 'react-router'
import { usePersistedState } from '../hooks/usePersistedState'
import { useHotkeys } from '../hooks/useRepositoryHotkeys'

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

  const { bottomProbe, items, setItems, tags, setTags } = useInfinityLoader()
  const [, setDialog] = useRecoilState(dialogVisibility)
  const [, setToken] = usePersistedState(tokenState)
  const history = useHistory()

  const [detailItemId, setDetailItemId] = useState<string>(null)
  const handlePrev = useCallback(() => {
    let index = detailItemId
      ? _.findIndex(items, (item) => item.itemId === detailItemId)
      : 0

    index = _.clamp(index - 1, 0, Math.max(items.length - 1, 0))

    setDetailItemId(items[index].itemId)
  }, [detailItemId, items])

  const handleNext = useCallback(() => {
    let index = detailItemId
      ? _.findIndex(items, (item) => item.itemId === detailItemId)
      : 0

    index = _.clamp(index + 1, 0, Math.max(items.length - 1, 0))

    setDetailItemId(items[index].itemId)
  }, [detailItemId, items])

  const tagList = useMemo(() => getUniqueTagsByFrequency(items), [items])
  const tagOptions = useMemo(
    () => _.map(tagList, (t) => ({ label: t, value: t })),
    [tagList]
  )
  const selectedTagOptions = useMemo(
    () => _.map(tags, (t) => ({ label: t, value: t })),
    [tags]
  )

  const showAddDialog = useCallback(() => setDialog('Upload'), [setDialog])

  const showSettingsDialog = useCallback(() => setDialog('Settings'), [
    setDialog,
  ])

  const closeDialog = useCallback(() => {
    setDialog(null)
  }, [setDialog])

  const logout = useCallback(() => {
    history.push('/')
    setToken('')
  }, [history, setToken])

  const handleShowDetail = useCallback(
    (itemId: string) => {
      setDetailItemId(itemId)
      setDialog('Detail')
    },
    [setDialog]
  )

  const handleUploadFinished = useCallback(
    (newItems) => {
      setItems((i) => [...newItems, ...i])
      setDialog(null)
    },
    [setDialog, setItems]
  )

  const handleItemDelete = useCallback(
    (item: MetaItem) => {
      setItems((storedItems) =>
        _.reject(storedItems, (it) => it.itemId === item.itemId)
      )
    },
    [setItems]
  )

  const handleItemUpdate = useCallback(
    (updatedItem: MetaItem) => {
      setItems((storedItems) =>
        _.map(storedItems, (item) =>
          item.itemId === updatedItem.itemId
            ? { ...item, ...updatedItem }
            : item
        )
      )
    },
    [setItems]
  )

  const handleBlobLoad = useCallback(
    (itemId: string, url: string) => {
      setItems((storedItems) =>
        _.map(storedItems, (item) =>
          item.itemId === itemId ? { ...item, blobUrl: url } : item
        )
      )
    },
    [setItems]
  )

  useHotkeys({
    onAdd: showAddDialog,
    onEscape: closeDialog,
    onPrev: handlePrev,
    onNext: handleNext,
  })

  return (
    <Container>
      <DialogUpload onUploadFinished={handleUploadFinished} />
      <DialogDetail item={_.find(items, (it) => it.itemId === detailItemId)} />
      <DialogSettings />

      <CreatableSelect
        closeMenuOnSelect={false}
        options={tagOptions}
        value={selectedTagOptions}
        onChange={(vals) => {
          setTags(_.map(vals, (v) => v.value))
        }}
      />

      <ItemsGrid>
        {_.map(items, (item) => (
          <StoredItem
            key={item.itemId}
            item={item}
            onDeleted={handleItemDelete}
            onUpdated={handleItemUpdate}
            onDetail={handleShowDetail}
            onBlobLoad={handleBlobLoad}
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
