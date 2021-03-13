import _ from 'lodash'
import { FC, ReactNode, useCallback } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Req, Res } from 'use-http'

import { Flex } from '../components'
import { MemzResponse } from './useApi'

export const Notification: FC<{ title?: string }> = ({ title, children }) => {
  return (
    <Flex flexDirection="column">
      <b>{title}</b>
      {children}
    </Flex>
  )
}

export function useNotifications() {
  const toast = useToasts()

  const addHttpToast = useCallback(
    (req: Req, res: Res<MemzResponse<any>>, successMessage?: ReactNode) =>
      toast.addToast(
        <Notification
          title={
            !req.error && res.ok
              ? 'Ok'
              : (res.data as any)?.error?.errorCode || 'Error'
          }
        >
          {!req.error && res.ok
            ? successMessage || 'Done'
            : _.toString(req.error) || (res.data as any)?.error?.errorMessage}
        </Notification>,
        { appearance: !req.error && res.ok ? 'success' : 'error' }
      ),
    [toast]
  )

  return {
    ...toast,
    addHttpToast,
  }
}
