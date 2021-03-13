import _ from 'lodash'
import { FC, ReactNode, useCallback } from 'react'
import { AppearanceTypes, useToasts } from 'react-toast-notifications'
import { Req, Res } from 'use-http'

import { Flex } from '../components'
import { MemzResponse } from './useApi'

export const Notification: FC<{ title?: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <Flex flexDirection="column">
      <b>{title}</b>
      {children}
    </Flex>
  )
}

export function useNotifications() {
  const { addToast, ...rest } = useToasts()

  const notifyHttp = useCallback(
    (req: Req, res: Res<MemzResponse<any>>, successMessage?: ReactNode) =>
      addToast(
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
    [addToast]
  )

  const notify = useCallback(
    (
      title: ReactNode,
      message: ReactNode,
      appearance: AppearanceTypes = 'info'
    ) => {
      addToast(<Notification title={title}>{message}</Notification>, {
        appearance,
      })
    },
    [addToast]
  )

  return {
    ...rest,
    addToast,
    notify,
    notifyHttp,
  }
}
