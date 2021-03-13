import { useRecoilState } from 'recoil'
import { FC, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import _ from 'lodash'
import styled from 'styled-components'

import { dialogVisibility } from '../state/dialogState'
import { Dialog } from './Dialog'
import { MemzResponse, useApi } from '../hooks/useApi'
import { useNotifications } from '../hooks/useNotifications'

interface UploadDialogProps {
  onUploadFinished(items?: MetaItem[]): void
}

const DropZoneContainer = styled.div`
  padding: 5vw;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border1};
`

export const DialogUpload: FC<UploadDialogProps> = ({ onUploadFinished }) => {
  const [dialog] = useRecoilState(dialogVisibility)
  const { addHttpToast } = useNotifications()

  const { post, loading, request, response } = useApi<MemzResponse<MetaItem[]>>(
    {
      method: 'POST',
      path: `/api/repository/items`,
    }
  )

  const pasteHandler = useCallback((e: ClipboardEvent) => {
    if (!_.isEmpty(e.clipboardData.files)) {
      console.log(e.clipboardData.files)
      uploadFiles(e.clipboardData.files)
    }

    console.log('clip getData()', e.clipboardData.getData('text/plain'))
    console.log('clip getData()', e.clipboardData.getData('text/uri-list'))
  }, [])

  const uploadFiles = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData()
      _.forEach(acceptedFiles, (f) => {
        formData.append('files', f)
      })
      await post(formData)

      addHttpToast(request, response, 'Image/s uploaded')

      if (response.ok) {
        onUploadFinished(response.data.data)
      }
    },
    [post, addHttpToast, request, response, onUploadFinished]
  )

  useEffect(() => {
    document.addEventListener('paste', pasteHandler)
    return () => document.removeEventListener('paste', pasteHandler)
  }, [pasteHandler, uploadFiles])

  const { getRootProps, getInputProps } = useDropzone({ onDrop: uploadFiles })

  return (
    dialog === 'Upload' && (
      <Dialog>
        <DropZoneContainer {...getRootProps()}>
          {loading && 'Uploading'}
          {!loading && <p>Click, drag files here or paste to upload</p>}
          <input {...getInputProps()} disabled={loading} />
        </DropZoneContainer>
      </Dialog>
    )
  )
}
