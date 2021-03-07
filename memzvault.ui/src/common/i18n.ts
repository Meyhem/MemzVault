import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../i18n/en.json'
import kek from '../i18n/kek.json'

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en, kek },
})
