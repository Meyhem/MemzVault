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
import { Link } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`

const SettingsItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-bottom: 50px;
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

  const fontOptions = _.map(
    [
      'Source Code Pro',
      'Audiowide',
      'UnifrakturMaguntia',
      'Boogaloo',
      'Merienda One',
    ],
    (f) => ({
      value: f,
      label: <span style={{ fontFamily: f }}>{f}</span>,
    })
  )

  return (
    dialog === 'Settings' && (
      <Dialog>
        <Container>
          <SettingsItem>
            <Label>Font</Label>
            <Select
              value={{
                label: settings[repoName]?.font || 'Source Code Pro',
                value: settings[repoName]?.font || 'Source Code Pro',
              }}
              options={fontOptions}
              onChange={(v) => {
                updateSettings({ font: v.value })
              }}
            />
          </SettingsItem>
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
          <SettingsItem>
            <Label>Keybinds</Label>
            <div>[+] Upload new</div>
            <div>[A] Prev item</div>
            <div>[D] Next item</div>
          </SettingsItem>
          <SettingsItem>
            <Link to="/create">Create repo</Link>
          </SettingsItem>
        </Container>
      </Dialog>
    )
  )
}
