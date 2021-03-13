import { FC } from 'react'
import { useRecoilState } from 'recoil'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import styled from 'styled-components'

import { isImage } from '../common/util'
import { dialogVisibility } from '../state/dialogState'
import { Dialog } from './Dialog'

interface DialogDetailProps {
  blobUrl: string
  metaItem: MetaItem
}

const Image = styled.img`
  max-width: 100%;
  min-width: 40vw;
`

export const DialogDetail: FC<DialogDetailProps> = ({ blobUrl, metaItem }) => {
  const [dialog] = useRecoilState(dialogVisibility)
  return (
    dialog === 'Detail' && (
      <Dialog>
        <TransformWrapper
          wheel={{ step: 5 }}
          defaultPositionY={0}
          options={{
            minScale: 0.1,
            centerContent: false,
            limitToBounds: false,
            limitToWrapper: true,
          }}
        >
          <TransformComponent>
            {isImage(metaItem) && <Image src={blobUrl} />}
          </TransformComponent>
        </TransformWrapper>
      </Dialog>
    )
  )
}
