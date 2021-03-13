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
  const { notifyHttp, notify } = useNotifications()

  const { post, loading, request, response } = useApi<MemzResponse<MetaItem[]>>(
    {
      method: 'POST',
      path: `/api/repository/items`,
    }
  )

  const {
    post: uploadPost,
    request: uploadRequest,
    response: uploadResponse,
  } = useApi<MemzResponse<MetaItem>>({
    method: 'POST',
    path: `/api/repository/items/remote-download`,
  })

  const uploadFiles = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData()
      _.forEach(acceptedFiles, (f) => {
        formData.append('files', f)
      })
      await post(formData)

      notifyHttp(request, response, 'Image/s uploaded')

      if (response.ok) {
        onUploadFinished(response.data.data)
      }
    },
    [post, notifyHttp, request, response, onUploadFinished]
  )

  const pasteHandler = useCallback(
    async (e: ClipboardEvent) => {
      if (!_.isEmpty(e.clipboardData.files)) {
        uploadFiles(e.clipboardData.files)
        return
      }

      const str = e.clipboardData.getData('text/plain')
      try {
        const url = new URL(str)
        notify('Paste', 'Downloading URL', 'success')
        await uploadPost({ url })
        notifyHttp(uploadRequest, uploadResponse, 'Downloaded!')
        if (uploadResponse.ok) {
          const newMeta = uploadResponse.data?.data
          if (newMeta) {
            onUploadFinished([newMeta])
          }
        }
      } catch (e) {
        notify('Paste', 'Nothing reasonable in clipboard', 'warning')
      }
    },
    [
      notify,
      notifyHttp,
      onUploadFinished,
      uploadFiles,
      uploadPost,
      uploadRequest,
      uploadResponse,
    ]
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
