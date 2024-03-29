import { FC } from 'react'
import { useRecoilState } from 'recoil'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import styled from 'styled-components'

import { isImage, isVideo } from '../common/util'
import { dialogVisibility } from '../state/dialogState'
import { Dialog } from './Dialog'

interface DialogDetailProps {
  item: MetaItem
}

const Image = styled.img`
  max-width: 100%;
  min-width: 40vw;
`

const Video = styled.video`
  max-width: 100%;
  min-width: 40vw;
`

export const DialogDetail: FC<DialogDetailProps> = ({ item }) => {
  const [dialog] = useRecoilState(dialogVisibility)
  return (
    dialog === 'Detail' && (
      <Dialog>
        <TransformWrapper
          wheel={{ step: 10 }}
          defaultPositionY={0}
          options={{
            minScale: 0.1,
            centerContent: false,
            limitToBounds: false,
            limitToWrapper: true,
          }}
        >
          <TransformComponent>
            {isImage(item) && <Image src={item.blobUrl} />}
            {isVideo(item) && (
              <Video preload="metadata" controls={true}>
                <source src={item.blobUrl} type={item.mimeType} />
              </Video>
            )}
          </TransformComponent>
        </TransformWrapper>
      </Dialog>
    )
  )
}
