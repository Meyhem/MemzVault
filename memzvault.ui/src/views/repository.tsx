import _ from 'lodash'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'

import { useInfinityLoader } from '../hooks/useInfinityLoader'
import { StoredItem, DialogUpload } from '../components'

import { dialogVisibility } from '../state/dialogState'

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

export const RepositoryPage = () => {
  const { bottomProbe, items, setItems } = useInfinityLoader()
  const [dialog, setDialog] = useRecoilState(dialogVisibility)

  return (
    <Container>
      <DialogUpload
        onUploadFinished={(newItems) => setItems((i) => [...newItems, ...i])}
      />
      <ItemsGrid>
        {_.map(items, (item, i) => (
          <StoredItem key={item.itemId} item={item} />
        ))}
      </ItemsGrid>
      <BottomProbe ref={bottomProbe} />
    </Container>
  )
}
