import _ from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { settingsState } from '../state/repositorySettings'
import { getRepositoryName } from '../state/tokenState'

export function useGlobalHook() {
  const settings = useRecoilValue(settingsState)
  const repoName = useRecoilValue(getRepositoryName)
  const { i18n } = useTranslation()

  const lang = _.get(settings as any, `${repoName}.language`)
  useEffect(() => {
    if (!lang) return
    i18n.changeLanguage(lang)
  }, [i18n, lang])
}
