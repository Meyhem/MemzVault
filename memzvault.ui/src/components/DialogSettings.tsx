import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import styled from 'styled-components'

import { dialogVisibility } from '../state/dialogState'
import { RepositorySettings, settingsState } from '../state/repositorySettings'
import { getRepositoryName } from '../state/tokenState'
import { Dialog } from './Dialog'
import { Select } from './Select'
import { usePersistedState } from '../hooks/usePersistedState'

import flagUs from '../assets/flag-us.png'
import flagKek from '../assets/flag-kek.png'
import { Flex } from './Flex'

const Container = styled.div`
  display: flex;
  width: 100%;
`

const SettingsItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
`

const Label = styled.span`
  font-weight: bold;
`

const FlagIcon = styled.img`
  width: 35px;
  height: 25px;
  margin-right: 5px;
`

type LangConfig = {
  flag: string
  name: string
}

const langMap: Dictionary<LangConfig> = {
  en: { flag: flagUs, name: "'murican" },
  kek: { flag: flagKek, name: 'Kekistani' },
}

export const DialogSettings = () => {
  const [dialog] = useRecoilState(dialogVisibility)
  const [settings, setSettings] = usePersistedState(settingsState)
  const repoName = useRecoilValue(getRepositoryName)
  const { i18n } = useTranslation()

  const updateSettings = (update: Partial<RepositorySettings>) => {
    setSettings({
      ...settings,
      [repoName]: { ...settings[repoName], ...update },
    })
  }

  const langOptions = _.map(_.keys(i18n.store.data), (lang) => ({
    label: (
      <Flex alignItems="center">
        <FlagIcon src={langMap[lang].flag} /> {langMap[lang].name}
      </Flex>
    ),
    value: lang,
  }))

  return (
    dialog === 'Settings' && (
      <Dialog>
        <Container>
          <SettingsItem>
            <Label>Language</Label>
            <Select
              value={{
                label: langMap[i18n.language].name,
                value: i18n.language,
              }}
              options={langOptions}
              onChange={(v) => {
                updateSettings({ language: v.value })
              }}
            />
          </SettingsItem>
        </Container>
      </Dialog>
    )
  )
}
