import { FC } from 'react'

export const ResetPage: FC = () => {
  localStorage.clear()

  location.href = '/'
  return null
}
